if ( window.wc && window.wc.wcBlocksRegistry && window.wp && window.wp.element ) {

    const { registerPaymentMethod } = window.wc.wcBlocksRegistry;
    const { getSetting } = window.wc.wcSettings;
    const { createElement, useEffect, useRef } = window.wp.element;

    const settings = getSetting( 'apolo_pay_data', {} );
    const name = 'apolo_pay';

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
     * the money already sent on the first one. Module scope: it outlives the
     * block re-rendering.
     */
    let partialProcessId = null;

    const BlockContent = ( props ) => {
        const { eventRegistration } = props;
        const { onPaymentSetup } = eventRegistration;
        const smartPayRef = useRef( null );

        useEffect( () => {
            const unsubscribe = onPaymentSetup( async () => {

                const formData = new URLSearchParams();
                formData.append( 'action', 'apolopay_create_process' );
                formData.append( 'security', settings.nonce );
                formData.append( 'resume_process_id', partialProcessId || '' );

                try {
                    const response = await fetch( settings.ajaxUrl, {
                        method: 'POST',
                        body: formData,
                    } );
                    const result = await response.json();

                    if ( result.success && result.data.process_id ) {
                        const processId = result.data.process_id;
                        const resumed = !! result.data.resumed;
                        const component = smartPayRef.current;

                        if ( partialProcessId && ! resumed ) {
                            window.alert( CART_CHANGED_MESSAGE );
                        }
                        partialProcessId = null;

                        component.client = new window.NexoraSmartPay.SmartPayClient( {
                            publicKey: settings.publicKey,
                        } );
                        component.setAttribute( 'process-id', processId );

                        return new Promise( ( resolve ) => {

                            const cleanupEvents = () => {
                                component.removeEventListener( 'success', handleSuccess );
                                component.removeEventListener( 'error', handleError );
                                component.removeEventListener( 'expired', handleExpired );
                                component.removeEventListener( 'dismissed', handleDismissed );
                                component.removeEventListener( 'partialPayment', handlePartialPayment );
                            };

                            // Closed after a partial payment: keep the process to go
                            // on paying it on the next "Place order".
                            const handlePartialPayment = () => {
                                cleanupEvents();
                                partialProcessId = processId;
                                resolve( { type: 'error', message: PARTIAL_MESSAGE } );
                            };

                            /**
                             * WebSocket "success": customer has completed the crypto
                             * payment. Pass the processId to WooCommerce so that
                             * process_payment() can save it and set the order to
                             * "on-hold", awaiting the Nexora SmartPay webhook confirmation.
                             */
                            const handleSuccess = () => {
                                cleanupEvents();
                                resolve( {
                                    type: 'success',
                                    meta: {
                                        paymentMethodData: {
                                            apolo_process_id: processId,
                                        },
                                    },
                                } );
                            };

                            const handleError = ( e ) => {
                                cleanupEvents();
                                resolve( {
                                    type: 'error',
                                    message: e.detail?.message || 'Error en el pago.',
                                } );
                            };

                            const handleExpired = () => {
                                cleanupEvents();
                                resolve( {
                                    type: 'error',
                                    message: 'El tiempo para pagar ha expirado.',
                                } );
                            };

                            const handleDismissed = () => {
                                cleanupEvents();
                                // A process that already received part of the payment
                                // is still pending: keep going on it next time.
                                if ( resumed ) partialProcessId = processId;
                                resolve( {
                                    type: 'error',
                                    message: 'Cancelaste el proceso de pago. Puedes intentar de nuevo.',
                                } );
                            };

                            component.addEventListener( 'success', handleSuccess );
                            component.addEventListener( 'error', handleError );
                            component.addEventListener( 'expired', handleExpired );
                            component.addEventListener( 'dismissed', handleDismissed );
                            component.addEventListener( 'partialPayment', handlePartialPayment );

                            setTimeout( () => {
                                try {
                                    const wrapper = component.shadowRoot
                                        ? component.shadowRoot.getElementById( 'trigger-wrapper' )
                                        : null;
                                    if ( wrapper ) {
                                        wrapper.click();
                                    } else {
                                        component.click();
                                    }
                                } catch ( err ) {
                                    component.click();
                                }
                            }, 150 );
                        } );

                    } else {
                        return {
                            type: 'error',
                            message: result.data?.message || 'Error al conectar con Nexora SmartPay.',
                        };
                    }
                } catch ( error ) {
                    return { type: 'error', message: 'Error de red.' };
                }
            } );

            return () => {
                unsubscribe();
            };
        }, [ onPaymentSetup ] );

        return createElement(
            'div',
            { className: 'apolo-pay-block-content' },
            createElement( 'p', null, settings.description || 'Paga de forma segura con Nexora SmartPay.' ),
            createElement( 'smartpay-button', {
                ref: smartPayRef,
                style: { position: 'absolute', width: '0', height: '0', overflow: 'hidden' },
            }, createElement( 'span', { slot: '' } ) )
        );
    };

    const Label = () => {
        return createElement(
            'span',
            { style: { width: '100%', display: 'flex', alignItems: 'center', gap: '8px' } },
            settings.title || 'Nexora SmartPay'
        );
    };

    const SmartPayBlocksIntegration = {
        name: name,
        label: createElement( Label, null ),
        content: createElement( BlockContent, null ),
        edit: createElement( BlockContent, null ),
        canMakePayment: () => true,
        ariaLabel: settings.title || 'Nexora SmartPay',
        supports: { features: [ 'products' ] },
    };

    registerPaymentMethod( SmartPayBlocksIntegration );

} else {
    console.error( 'Nexora SmartPay: Faltan dependencias de WooCommerce Blocks.' );
}