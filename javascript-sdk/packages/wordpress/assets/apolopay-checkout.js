/* global jQuery, apolo_params */
jQuery(function ($) {
    'use strict';

    // Referencias al DOM
    const checkout_form = $('form.checkout');
    const componentSelector = 'apolopay-button';

    /**
     * Utilidad para bloquear la UI de WooCommerce (Overlay de carga)
     */
    const blockUI = () => {
        checkout_form.addClass('processing').block({
            message: null,
            overlayCSS: { background: '#fff', opacity: 0.6 }
        });
    };

    const unblockUI = () => {
        checkout_form.removeClass('processing').unblock();
    };

    /**
     * Interceptamos el evento 'checkout_place_order'
     * Este evento se dispara cuando el usuario hace clic en "Realizar Pedido"
     */
    checkout_form.on('checkout_place_order', function () {

        // 1. Verificar si el método de pago seleccionado es Apolo Pay
        if ($('#payment_method_apolo_pay').is(':checked')) {

            // 2. Si ya tenemos un Transaction ID en el input oculto, dejamos pasar el envío
            // Esto significa que el pago ya fue exitoso en el modal.
            if ($('#apolo_transaction_id').val() !== '') {
                return true;
            }

            // LOG DE DIAGNÓSTICO: Ver si el elemento existe antes de la AJAX
            console.log('Buscando componente:', componentSelector);
            console.log('¿Existe en el DOM?:', $(componentSelector).length > 0);

            // 3. INICIO DEL FLUJO DE PAGO
            console.log('Apolo Pay: Iniciando solicitud de Process ID...');
            blockUI();

            // 4. Llamada AJAX a WordPress para obtener el Process ID (usando Secret Key en backend)
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

                        // Buscar componente (por si el DOM cambió por AJAX de WooCommerce)
                        const component = document.querySelector(componentSelector);

                        if (component && window.ApoloPaySDK) {
                            // 1. Instanciar el cliente que el Web Component necesita
                            component.client = new window.ApoloPaySDK.ApoloPayClient({
                                publicKey: apolo_params.public_key
                            });

                            const processId = response.data.process_id;
                            console.log('Apolo Pay: Process ID recibido', processId);

                            // 2. Usar el nombre de atributo correcto (process-id)
                            component.setAttribute('process-id', processId);

                            // Esperar un momento para que el componente reaccione a los cambios
                            setTimeout(() => {
                                unblockUI();

                                // 6. Abrir el modal
                                try {
                                    const wrapper = component.shadowRoot.getElementById('trigger-wrapper');
                                    if (wrapper) {
                                        wrapper.click();
                                        console.log('Apolo Pay: Click en Shadow DOM wrapper');
                                    } else {
                                        component.click();
                                        console.log('Apolo Pay: Click en Host Element (Fallback)');
                                    }
                                    console.log('Apolo Pay: Modal abierto');
                                } catch (e) {
                                    console.error('Apolo Pay: Error al intentar abrir el modal', e);
                                    component.click();
                                }
                            }, 100);

                        } else {
                            unblockUI();
                            console.error('Apolo Pay: Componente no encontrado en el DOM.');
                            alert('Error interno: No se pudo cargar la pasarela de pago.');
                        }

                    } else {
                        unblockUI();
                        console.error('Apolo Pay: Error en respuesta AJAX', response);
                        alert('Error al iniciar el pago: ' + (response.data.message || 'Error desconocido'));
                    }
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    unblockUI();
                    console.error('Apolo Pay: Error AJAX fatal', textStatus, errorThrown);
                    alert('Error de conexión con el servidor. Por favor intente nuevamente.');
                }
            });

            // Retornamos false para detener el envío original del formulario
            return false;
        }
    });

    /**
     * Escuchar eventos del Web Component
     * Usamos delegación de eventos o re-buscamos el elemento porque WooCommerce
     * refresca partes del DOM vía AJAX cuando cambias de método de pago.
     */

    // Función para adjuntar listeners
    const attachListeners = () => {
        const btn = document.querySelector(componentSelector);
        if (btn) {
            // SUCCESS
            btn.addEventListener('success', (event) => {
                console.log('Apolo Pay: Pago Exitoso', event.detail);

                // Llenar el input oculto con el Transaction ID
                $('#apolo_transaction_id').val(event.detail.transactionId || event.detail.id);

                // Reenviar el formulario de WooCommerce (ahora pasará el chequeo del paso 2)
                checkout_form.submit();
            });

            // ERROR
            btn.addEventListener('error', (event) => {
                console.error('Apolo Pay: Error en el pago', event.detail);

                // Mostrar mensaje de error nativo de WooCommerce
                $('.woocommerce-error, .woocommerce-message').remove();
                checkout_form.prepend('<div class="woocommerce-error">Error en el pago: ' + (event.detail.message || 'Transacción fallida') + '</div>');

                // Scroll hacia arriba para ver el error
                $('html, body').animate({
                    scrollTop: (checkout_form.offset().top - 100)
                }, 1000);
            });
        }
    };

    // Inicializar listeners al cargar
    attachListeners();

    // Re-inicializar listeners si WooCommerce actualiza el checkout (evento 'updated_checkout')
    $(document.body).on('updated_checkout', function () {
        attachListeners();
    });

});