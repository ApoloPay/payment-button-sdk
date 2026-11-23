/* global jQuery, apolo_params */
jQuery(function ($) {
    'use strict';

    const formSelector      = 'form.checkout';
    const componentSelector = 'smartpay-button';

    const blockUI = () => {
        $(formSelector).addClass('processing').block({
            message: null,
            overlayCSS: { background: '#fff', opacity: 0.6 }
        });
    };

    const unblockUI = () => {
        $(formSelector).removeClass('processing').unblock();
    };

    const PARTIAL_MESSAGE =
        'Recibimos un pago parcial. Para completar tu pedido, vuelve a presionar ' +
        '"Realizar pedido" y paga el monto restante con la misma moneda y red.';
    const CART_CHANGED_MESSAGE =
        'El total del carrito cambió desde tu pago parcial, así que se generó un cobro nuevo. ' +
        'Para recuperar el pago parcial anterior, contacta a la tienda.';

    /**
     * Process that received a partial payment and was closed before the rest
     * arrived. The next "Place order" goes on paying it (like the SDK's modal
     * does while open) instead of creating a new preorder, which would leave
     * the money already sent on the first one.
     */
    let partialProcessId = null;

    /**
     * Hook into WooCommerce's own event: checkout_place_order_{gateway_id}
     * This event fires AFTER WooCommerce has validated all required checkout
     * fields (name, email, address, postal code, etc.).
     *
     * IMPORTANT: WooCommerce uses jQuery.triggerHandler() which does NOT
     * bubble up the DOM. The handler MUST be bound directly on the form
     * element, not on document.body.
     *
     * Returning false  → prevents WooCommerce from submitting the order.
     * Returning true   → lets WooCommerce proceed normally.
     */
    $(formSelector).on('checkout_place_order_apolo_pay', function () {
        const processIdInput = document.querySelector('#apolo_process_id');

        // The process ID is only set once the payment is complete (WebSocket
        // "success"): then let WooCommerce proceed with order creation.
        if (processIdInput && processIdInput.value !== '') {
            return true;
        }

        // No process ID yet → start the Nexora SmartPay flow and block WooCommerce.
        iniciarFlujoSmartPay();
        return false;
    });

    function iniciarFlujoSmartPay() {
        blockUI();

        // Clear any stale processId from a previous attempt.
        const processIdInput = document.querySelector('#apolo_process_id');
        if (processIdInput) processIdInput.value = '';

        $.ajax({
            type: 'POST',
            url: apolo_params.ajax_url,
            dataType: 'json',
            data: {
                action: 'apolopay_create_process',
                security: apolo_params.nonce,
                resume_process_id: partialProcessId || ''
            },
            success: function (response) {
                if (response.success && response.data.process_id) {
                    const processId = response.data.process_id;

                    if (partialProcessId && !response.data.resumed) {
                        alert(CART_CHANGED_MESSAGE);
                    }
                    partialProcessId = null;

                    const component = document.querySelector(componentSelector);

                    if (component && window.NexoraSmartPay) {
                        component.client = new window.NexoraSmartPay.SmartPayClient({
                            publicKey: apolo_params.public_key
                        });
                        component.setAttribute('process-id', processId);

                        const cleanupEvents = () => {
                            component.removeEventListener('success', handleSuccess);
                            component.removeEventListener('error', handleError);
                            component.removeEventListener('expired', handleExpired);
                            component.removeEventListener('dismissed', handleDismissed);
                            component.removeEventListener('partialPayment', handlePartialPayment);
                        };

                        /**
                         * WebSocket "success" event: the customer has completed the
                         * crypto payment. We put the order in "on-hold" via
                         * process_payment() on the server; the order will be moved to
                         * "processing" only after the Nexora SmartPay webhook confirms it.
                         */
                        const handleSuccess = () => {
                            cleanupEvents();
                            unblockUI();

                            // Only now, with the payment complete, the processId goes
                            // to the order; re-trigger WooCommerce's AJAX checkout.
                            // process_payment() sets the order to "on-hold" and saves
                            // the processId for the webhook handler.
                            if (processIdInput) processIdInput.value = processId;
                            $(formSelector).trigger('submit');
                        };

                        // Closed after a partial payment: keep the process to go on
                        // paying it on the next "Place order".
                        const handlePartialPayment = () => {
                            cleanupEvents();
                            partialProcessId = processId;
                            unblockUI();
                            alert(PARTIAL_MESSAGE);
                        };

                        const handleError = (e) => {
                            cleanupEvents();
                            // Clear processId so a fresh attempt can be made.
                            if (processIdInput) processIdInput.value = '';
                            unblockUI();
                            alert('Error en el pago: ' + (e.detail?.message || 'Intenta de nuevo.'));
                        };

                        const handleExpired = () => {
                            cleanupEvents();
                            if (processIdInput) processIdInput.value = '';
                            unblockUI();
                            alert('El tiempo para pagar ha expirado.');
                        };

                        const handleDismissed = () => {
                            cleanupEvents();
                            // A process that had already received part of the payment
                            // is still pending: keep going on it next time. Otherwise
                            // the next "Place Order" starts a fresh preorder.
                            if (response.data.resumed) partialProcessId = processId;
                            if (processIdInput) processIdInput.value = '';
                            unblockUI();
                        };

                        component.addEventListener('success', handleSuccess);
                        component.addEventListener('error', handleError);
                        component.addEventListener('expired', handleExpired);
                        component.addEventListener('dismissed', handleDismissed);
                        component.addEventListener('partialPayment', handlePartialPayment);

                        setTimeout(() => {
                            try {
                                const wrapper = component.shadowRoot
                                    ? component.shadowRoot.getElementById('trigger-wrapper')
                                    : null;
                                if (wrapper) wrapper.click();
                                else component.click();
                            } catch (err) {
                                component.click();
                            }
                        }, 150);

                    } else {
                        if (processIdInput) processIdInput.value = '';
                        unblockUI();
                        alert('Error interno: No se pudo cargar la pasarela.');
                    }
                } else {
                    if (processIdInput) processIdInput.value = '';
                    unblockUI();
                    alert('Error al conectar con Nexora SmartPay.');
                }
            },
            error: function () {
                if (processIdInput) processIdInput.value = '';
                unblockUI();
                alert('Error de conexión con el servidor.');
            }
        });
    }
});