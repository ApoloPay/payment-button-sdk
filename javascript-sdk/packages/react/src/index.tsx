import './style.css';
import React, { useState, useCallback } from 'react';
import { PaymentClient, PaymentOptions, PaymentResponse, PaymentError } from '@payment-button-sdk/core';

// Exportamos los tipos para que el usuario también los tenga
export * from '@payment-button-sdk/core';

// El Hook personalizado
export const usePaymentButton = (options: Omit<PaymentOptions, 'onSuccess' | 'onError'>) => {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [data, setData] = useState<PaymentResponse | null>(null);
  const [error, setError] = useState<PaymentError | null>(null);

  const pay = useCallback(() => {
    setStatus('loading');

    const client = new PaymentClient({
      ...options,
      onSuccess: (response) => {
        setData(response);
        setStatus('success');
        // (Opcional) Llamar a un onSuccess del usuario
        // options.onSuccess?.(response);
      },
      onError: (error) => {
        setError(error);
        setStatus('error');
        // (Opcional) Llamar a un onError del usuario
        // options.onError?.(error);
      },
    });

    client.initiatePayment();
  }, [options]); // Depende de 'options', pero simplificado

  return { pay, status, data, error };
};

// Un componente de botón listo para usar
interface PaymentButtonProps extends Omit<PaymentOptions, 'onSuccess' | 'onError'> {
  children: React.ReactNode;
}

export const PaymentButton: React.FC<PaymentButtonProps> = ({ children, ...options }) => {
  const { pay, status } = usePaymentButton(options);

  return (
    <button onClick={pay} disabled={status === 'loading'}>
      {status === 'loading' ? 'Procesando...' : children}
    </button>
  );
};