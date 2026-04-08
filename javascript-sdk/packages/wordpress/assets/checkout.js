/* global jQuery, apolo_params */
jQuery(function ($) {
    'use strict';

    const formSelector = 'form.checkout';
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
        const txIdInput = document.querySelector('#apolo_transaction_id');

        // If the transaction ID is already set (payment completed),
        // let WooCommerce proceed with order processing.
        if (txIdInput && txIdInput.value !== '') {
            return true;
        }

        // No transaction yet → start the Apolo Pay flow and block WooCommerce.
        iniciarFlujoApoloPay();
        return false;
    });

    function iniciarFlujoApoloPay() {
        blockUI();

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
                    const component = document.querySelector(componentSelector);

                    if (component && window.ApoloPaySDK) {
                        component.client = new window.ApoloPaySDK.ApoloPayClient({
                            publicKey: apolo_params.public_key
                        });
                        component.setAttribute('process-id', response.data.process_id);

                        const cleanupEvents = () => {
                            component.removeEventListener('success', handleSuccess);
                            component.removeEventListener('error', handleError);
                            component.removeEventListener('expired', handleExpired);
                            component.removeEventListener('dismissed', handleDismissed);
                        };

                        const handleSuccess = (e) => {
                            cleanupEvents();
                            
                            const txId = e.detail?.result?.id || e.detail?.id;
                            document.querySelector('#apolo_transaction_id').value = txId;

                            // Remove .processing class and unblock BEFORE re-triggering
                            // submit. WooCommerce's submit handler checks for .processing
                            // and silently aborts if it's present.
                            unblockUI();

                            // Re-trigger WooCommerce's submit flow.
                            // This time txIdInput.value is set, so our handler
                            // will return true and WooCommerce will process the order
                            // via its normal AJAX checkout.
                            $(formSelector).trigger('submit');
                        };

                        const handleError = (e) => {
                            cleanupEvents();
                            unblockUI();
                            alert('Error en el pago: ' + (e.detail?.message || 'Intenta de nuevo.'));
                        };

                        const handleExpired = () => {
                            cleanupEvents();
                            unblockUI();
                            alert('El tiempo para pagar ha expirado.');
                        };

                        const handleDismissed = () => {
                            cleanupEvents();
                            unblockUI();
                        };

                        component.addEventListener('success', handleSuccess);
                        component.addEventListener('error', handleError);
                        component.addEventListener('expired', handleExpired);
                        component.addEventListener('dismissed', handleDismissed);

                        setTimeout(() => {
                            try {
                                const wrapper = component.shadowRoot ? component.shadowRoot.getElementById('trigger-wrapper') : null;
                                if (wrapper) wrapper.click();
                                else component.click();
                            } catch (err) {
                                component.click();
                            }
                        }, 150);

                    } else {
                        unblockUI();
                        alert('Error interno: No se pudo cargar la pasarela.');
                    }
                } else {
                    unblockUI();
                    alert('Error al conectar con Apolo Pay.');
                }
            },
            error: function () {
                unblockUI();
                alert('Error de conexión con el servidor.');
            }
        });
    }
});