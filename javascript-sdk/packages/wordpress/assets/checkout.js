/* global jQuery, apolo_params */
jQuery(function ($) {
    'use strict';

    const checkout_form = $('form.checkout');
    const componentSelector = 'apolopay-button';

    const blockUI = () => {
        checkout_form.addClass('processing').block({
            message: null,
            overlayCSS: { background: '#fff', opacity: 0.6 }
        });
    };

    const unblockUI = () => {
        checkout_form.removeClass('processing').unblock();
    };

    function iniciarFlujoApoloPay() {
        if (!$('#payment_method_apolo_pay').is(':checked')) return true; 
        if ($('#apolo_transaction_id').val() !== '') return true; 

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
                            $('#apolo_transaction_id').val(txId);
                            checkout_form[0].submit(); 
                        };

                        const handleError = (e) => {
                            cleanupEvents();
                            unblockUI();
                            alert('Error en el pago: ' + (e.detail?.message || 'Por favor, intenta de nuevo.'));
                        };

                        const handleExpired = () => {
                            cleanupEvents();
                            unblockUI();
                            alert('El tiempo para realizar el pago ha expirado.');
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
                        alert('Error interno: No se pudo cargar la interfaz de pago.');
                    }
                } else {
                    unblockUI();
                    alert('Error del servidor: No se pudo generar la intención de pago.');
                }
            },
            error: function () {
                unblockUI();
                alert('Error de conexión. Por favor, revisa tu internet e intenta de nuevo.');
            }
        });

        return false; 
    }

    // Intercepción 1: Evento oficial de WooCommerce
    checkout_form.on('checkout_place_order', function () {
        return iniciarFlujoApoloPay();
    });

    // Intercepción 2: Submit nativo del formulario HTML
    checkout_form.on('submit', function (e) {
        if ($('#payment_method_apolo_pay').is(':checked') && $('#apolo_transaction_id').val() === '') {
            e.preventDefault(); 
            iniciarFlujoApoloPay();
            return false;
        }
    });

    // Intercepción 3: Clic directo en el botón (prevención pasiva)
    $(document.body).on('click', '#place_order', function(e) {
        // Permitimos que el clic fluya para que el HTML5 valide campos obligatorios,
        // confiaremos en la Intercepción 2 para frenar el envío real.
    });

});