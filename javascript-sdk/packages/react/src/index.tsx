import '@apolopay-sdk/ui';
import React, { useRef, useEffect } from 'react';

// 2. Importa los tipos para las props
import type { Locale, ClientResponse, ClientError, ApoloPayClient, PaymentResponseData, PartialPaymentResponseData } from '@apolopay-sdk/ui';

// 3. Re-exporta los tipos de 'core' para el usuario final
//    (Nota: @core es una dependencia de @ui, que es una dependencia nuestra)
export * from '@apolopay-sdk/ui';

// 3. Define las props "tipo React" (onSuccess, publicKey)
type ApoloPayButtonProps = {
  client?: ApoloPayClient;
  processId?: string;
  productTitle?: string;
  lang?: Locale;
  barrierDismissible?: boolean;
  children?: React.ReactNode;
  disabled?: boolean;
  loading?: boolean;
  label?: string;
  onSuccess?: (response: ClientResponse<PaymentResponseData>) => void;
  onPartialPayment?: (response: ClientResponse<PartialPaymentResponseData>) => void;
  onError?: (error: ClientError) => void;
  onExpired?: (error: ClientError) => void;
  onDismissed?: () => void;
};

// 4. El componente de React ahora es un "ADAPTADOR"
export const ApoloPayButton: React.FC<ApoloPayButtonProps> = ({
  client,
  processId,
  productTitle,
  lang,
  barrierDismissible,
  children,
  disabled,
  loading,
  label,
  onSuccess,
  onPartialPayment,
  onError,
  onExpired,
  onDismissed,
}) => {
  const ref = useRef<HTMLElement>(null);

  // 5. Esconde la "fricción" de los eventos y propiedades aqui
  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    // 5.1 Sincronizamos las propiedades manuales (React 18 no lo hace solo para objetos)
    if (client) {
      (node as any).client = client;
    }

    // 5.2 Escucha el evento del Web Component y lo "traduce" al prop de React
    const handleSuccess = (event: Event) => {
      onSuccess?.((event as CustomEvent).detail);
    };
    const handlePartialPayment = (event: Event) => {
      onPartialPayment?.((event as CustomEvent).detail);
    };
    const handleError = (event: Event) => {
      onError?.((event as CustomEvent).detail);
    };
    const handleExpired = (event: Event) => {
      onExpired?.((event as CustomEvent).detail);
    };
    const handleDismissed = () => {
      onDismissed?.();
    };

    node.addEventListener('success', handleSuccess);
    node.addEventListener('partialPayment', handlePartialPayment);
    node.addEventListener('error', handleError);
    node.addEventListener('expired', handleExpired);
    node.addEventListener('dismissed', handleDismissed);

    return () => {
      node.removeEventListener('success', handleSuccess);
      node.removeEventListener('partialPayment', handlePartialPayment);
      node.removeEventListener('error', handleError);
      node.removeEventListener('expired', handleExpired);
      node.removeEventListener('dismissed', handleDismissed);
    };
  }, [client, onSuccess, onPartialPayment, onError, onExpired, onDismissed]);

  // 6. Renderiza el Web Component, pasando props de React (camelCase)
  //    a atributos HTML (kebab-case)
  return React.createElement(
    'apolopay-button',
    {
      ref,
      'process-id': processId,
      'product-title': productTitle,
      lang,
      disabled,
      loading,
      label,
      'barrier-dismissible': barrierDismissible,
    },
    children
  );
};