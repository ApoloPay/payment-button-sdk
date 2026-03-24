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

    document.addEventListener('submit', function(e) {
        const form = e.target;

        if (form && form.matches && form.matches(formSelector)) {
            const isApoloPay = document.querySelector('#payment_method_apolo_pay')?.checked;
            const txIdInput = document.querySelector('#apolo_transaction_id');

            if (isApoloPay && txIdInput && txIdInput.value === '') {
                e.preventDefault();
                e.stopImmediatePropagation();
                iniciarFlujoApoloPay();
            }
        }
    }, true); 

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

                            if (!document.querySelector('input[name="woocommerce_checkout_place_order"]')) {
                                $(formSelector).append('<input type="hidden" name="woocommerce_checkout_place_order" value="1" />');
                            }

                            HTMLFormElement.prototype.submit.call(document.querySelector(formSelector));
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