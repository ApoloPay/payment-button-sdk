/* global jQuery, apolo_params */
jQuery(function ($) {
    'use strict';

    const formSelector      = 'form.checkout';
    const componentSelector = 'apolopay-button';

    const blockUI = () => {
        $(formSelector).addClass('processing').block({
            message: null,
            overlayCSS: { background: '#fff', opacity: 0.6 }
        });
    };

    const unblockUI = () => {
        $(formSelector).removeClass('processing').unblock();
    };

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

        // If the process ID is already set (payment completed via WebSocket),
        // let WooCommerce proceed with order creation.
        if (processIdInput && processIdInput.value !== '') {
            return true;
        }

        // No process ID yet → start the Apolo Pay flow and block WooCommerce.
        iniciarFlujoApoloPay();
        return false;
    });

    function iniciarFlujoApoloPay() {
        blockUI();

        // Clear any stale processId from a previous attempt.
        const processIdInput = document.querySelector('#apolo_process_id');
        if (processIdInput) processIdInput.value = '';

        $.ajax({
            type: 'POST',
            url: apolo_params.ajax_url,
            dataType: 'json',
            data: {
                action: 'apolo_pay_create_process',
                security: apolo_params.nonce
            },
            success: function (response) {
                if (response.success && response.data.process_id) {
                    const processId = response.data.process_id;

                    // Store the processId immediately; it will be sent to
                    // process_payment() on the server when WC submits the order.
                    if (processIdInput) {
                        processIdInput.value = processId;
                    }

                    const component = document.querySelector(componentSelector);

                    if (component && window.ApoloPaySDK) {
                        component.client = new window.ApoloPaySDK.ApoloPayClient({
                            publicKey: apolo_params.public_key
                        });
                        component.setAttribute('process-id', processId);

                        const cleanupEvents = () => {
                            component.removeEventListener('success', handleSuccess);
                            component.removeEventListener('error', handleError);
                            component.removeEventListener('expired', handleExpired);
                            component.removeEventListener('dismissed', handleDismissed);
                        };

                        /**
                         * WebSocket "success" event: the customer has completed the
                         * crypto payment. We put the order in "on-hold" via
                         * process_payment() on the server; the order will be moved to
                         * "processing" only after the ApoloPay webhook confirms it.
                         */
                        const handleSuccess = () => {
                            cleanupEvents();
                            unblockUI();

                            // processId is already set above; re-trigger WooCommerce's
                            // AJAX checkout. process_payment() will set the order to
                            // "on-hold" and save the processId for the webhook handler.
                            $(formSelector).trigger('submit');
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
                            // Also clear processId when the user dismisses,
                            // so next "Place Order" click starts a fresh preorder.
                            if (processIdInput) processIdInput.value = '';
                            unblockUI();
                        };

                        component.addEventListener('success', handleSuccess);
                        component.addEventListener('error', handleError);
                        component.addEventListener('expired', handleExpired);
                        component.addEventListener('dismissed', handleDismissed);

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
                    alert('Error al conectar con Apolo Pay.');
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