if ( window.wc && window.wc.wcBlocksRegistry && window.wp && window.wp.element ) {
    
    const { registerPaymentMethod } = window.wc.wcBlocksRegistry;
    const { getSetting } = window.wc.wcSettings;
    const { createElement, useEffect, useRef } = window.wp.element;

    const settings = getSetting( 'apolo_pay_data', {} );
    const name = 'apolo_pay';

    const BlockContent = ( props ) => {
        const { eventRegistration } = props;
        
        // Usamos onPaymentSetup en lugar del obsoleto onPaymentProcessing
        const { onPaymentSetup } = eventRegistration; 
        const apoloPayRef = useRef( null );

        useEffect( () => {
            const unsubscribe = onPaymentSetup( async () => {
                
                const formData = new URLSearchParams();
                formData.append('action', 'apolo_pay_create_process');
                formData.append('security', settings.nonce);

                try {
                    const response = await fetch( settings.ajaxUrl, {
                        method: 'POST',
                        body: formData
                    });
                    const result = await response.json();

                    if ( result.success && result.data.process_id ) {
                        
                        const component = apoloPayRef.current;
                        
                        component.client = new window.ApoloPaySDK.ApoloPayClient({
                            publicKey: settings.publicKey
                        });
                        component.setAttribute('process-id', result.data.process_id);

                        return new Promise( ( resolve ) => {
                            
                            const handleSuccess = (e) => {
                                cleanupEvents();
                                const txId = e.detail?.result?.id || e.detail?.id;
                                resolve({
                                    type: 'success',
                                    meta: { paymentMethodData: { apolo_transaction_id: txId } }
                                });
                            };

                            const handleError = (e) => {
                                cleanupEvents();
                                resolve({ type: 'error', message: e.detail?.message || 'Error en el pago.' });
                            };

                            const handleExpired = (e) => {
                                cleanupEvents();
                                resolve({ type: 'error', message: 'El tiempo para pagar ha expirado.' });
                            };

                            // ✅ ESCUCHAMOS EL NUEVO EVENTO 'dismissed' DE TU COMPONENTE
                            const handleDismissed = () => {
                                cleanupEvents();
                                // Devolver un error detiene el spinner de WooCommerce y le permite al usuario volver a intentar
                                resolve({ type: 'error', message: 'Cancelaste el proceso de pago. Puedes intentar de nuevo.' });
                            };

                            const cleanupEvents = () => {
                                component.removeEventListener('success', handleSuccess);
                                component.removeEventListener('error', handleError);
                                component.removeEventListener('expired', handleExpired);
                                component.removeEventListener('dismissed', handleDismissed);
                            };

                            component.addEventListener('success', handleSuccess);
                            component.addEventListener('error', handleError);
                            component.addEventListener('expired', handleExpired);
                            component.addEventListener('dismissed', handleDismissed);

                            setTimeout(() => {
                                try {
                                    const wrapper = component.shadowRoot ? component.shadowRoot.getElementById('trigger-wrapper') : null;
                                    if (wrapper) {
                                        wrapper.click();
                                    } else {
                                        component.click();
                                    }
                                } catch (err) {
                                    component.click();
                                }
                            }, 150);
                        });

                    } else {
                        return { type: 'error', message: result.data?.message || 'Error al conectar con Apolo Pay.' };
                    }
                } catch (error) {
                    return { type: 'error', message: 'Error de red.' };
                }
            });

            return () => {
                unsubscribe();
            };
        }, [ onPaymentSetup ] ); 

        return createElement(
            'div',
            { className: 'apolo-pay-block-content' },
            createElement( 'p', null, settings.description || 'Paga de forma segura con Apolo Pay.' ),
            createElement( 'apolopay-button', { 
                ref: apoloPayRef, 
                // Mantenemos el truco de CSS para que el navegador lo dibuje sin ocupar espacio
                style: { position: 'absolute', width: '0', height: '0', overflow: 'hidden' } 
            }, createElement('span', { slot: '' }) )
        );
    };

    const Label = () => {
        return createElement(
            'span',
            { style: { width: '100%', display: 'flex', alignItems: 'center', gap: '8px' } },
            settings.title || 'Apolo Pay'
        );
    };

    const ApoloPayBlocksIntegration = {
        name: name,
        label: createElement( Label, null ),
        content: createElement( BlockContent, null ),
        edit: createElement( BlockContent, null ),
        canMakePayment: () => true,
        ariaLabel: settings.title || 'Apolo Pay',
        supports: { features: [ 'products' ] },
    };

    registerPaymentMethod( ApoloPayBlocksIntegration );

} else {
    console.error( 'Apolo Pay: Faltan dependencias de WooCommerce Blocks.' );
}