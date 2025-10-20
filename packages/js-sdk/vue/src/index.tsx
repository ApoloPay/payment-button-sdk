import './style.css'; // Importa el CSS para que tsup lo procese
import { ref, defineComponent, h, computed } from 'vue';

// 1. Importa la lógica y los tipos del CORE
import { PaymentClient, type PaymentOptions, type PaymentResponse, type PaymentError } from '@payment-button-sdk/core';

// 2. Re-exporta los tipos para el usuario final
export * from '@payment-button-sdk/core';

// 3. El "Composable" (equivalente al Hook de React)
export const usePaymentButton = (options: Omit<PaymentOptions, 'onSuccess' | 'onError'>) => {
  const status = ref<'idle' | 'loading' | 'success' | 'error'>('idle');
  const data = ref<PaymentResponse | null>(null);
  const error = ref<PaymentError | null>(null);

  const pay = () => {
    status.value = 'loading';
    const client = new PaymentClient({
      ...options,
      onSuccess: (response) => {
        data.value = response;
        status.value = 'success';
      },
      onError: (err) => {
        error.value = err;
        status.value = 'error';
      },
    });
    client.initiatePayment();
  };

  return { pay, status, data, error };
};

// 4. El Componente (creado con 'defineComponent' y 'h')
export const PaymentButton = defineComponent({
  name: 'PaymentButton',
  props: {
    apiKey: { type: String, required: true },
    amount: { type: Number, required: true },
    currency: { type: String, required: true },
    // ...puedes añadir más props aquí
  },
  setup(props, { slots }) {
    // Usa el composable
    const { pay, status } = usePaymentButton({
      apiKey: props.apiKey,
      amount: props.amount,
      currency: props.currency,
    });

    const isDisabled = computed(() => status.value === 'loading');

    // Renderiza el botón
    return () => h(
      'button',
      {
        class: 'payment-button-vue', // Usa la clase CSS de Vue
        onClick: pay,
        disabled: isDisabled.value,
      },
      // Texto del botón (Slot)
      status.value === 'loading' 
        ? 'Procesando...' 
        : (slots.default ? slots.default() : 'Pagar con Vue')
    );
  },
});