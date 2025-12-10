import '@payment-button-sdk/ui';
import React, { useRef, useEffect } from 'react';

// 2. Importa los tipos para las props
import type { PaymentResponse } from '@payment-button-sdk/ui';

// 3. Re-exporta los tipos de 'core' para el usuario final
//    (Nota: @core es una dependencia de @ui, que es una dependencia nuestra)
export * from '@payment-button-sdk/ui';

// 3. Define las props "tipo React" (onSuccess, apiKey)
type PaymentButtonProps = {
  apiKey: string;
  amount: number;
  children?: React.ReactNode;
  disabled?: boolean;
  loading?: boolean;
  label?: string;
  onSuccess?: (response: PaymentResponse) => void;
  onError?: (error: any) => void;
};

// 4. El componente de React ahora es un "ADAPTADOR"
export const PaymentButton: React.FC<PaymentButtonProps> = ({
  apiKey,
  amount,
  children,
  disabled,
  loading,
  label,
  onSuccess,
  onError,
}) => {
  const ref = useRef<HTMLElement>(null);

  // 5. Esconde la "fricción" de los eventos aquí
  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    // Escucha el evento del Web Component y lo "traduce" al prop de React
    const handleSuccess = (event: Event) => {
      onSuccess?.((event as CustomEvent).detail);
    };
    const handleError = (event: Event) => {
      onError?.((event as CustomEvent).detail);
    };

    node.addEventListener('success', handleSuccess);
    node.addEventListener('error', handleError);

    return () => {
      node.removeEventListener('success', handleSuccess);
      node.removeEventListener('error', handleError);
    };
  }, [onSuccess, onError]);

  // 6. Renderiza el Web Component, pasando props de React (camelCase)
  //    a atributos HTML (kebab-case)
  return React.createElement(
    'payment-button',
    {
      ref,
      'api-key': apiKey,
      amount,
      disabled,
      loading,
      label,
    },
    children
  );
};