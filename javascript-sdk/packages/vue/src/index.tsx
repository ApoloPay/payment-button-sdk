// 1. Importa el Web Component para registrarlo
import '@payment-button-sdk/ui';

// 2. Importa las herramientas de Vue
import { defineComponent, h, onMounted, ref } from 'vue';

// 3. Re-exporta los tipos de 'core' para el usuario final
//    (Nota: @core es una dependencia de @ui, que es una dependencia nuestra)
export * from '@payment-button-sdk/ui';

/**
 * El componente adaptador de Vue.
 * Traduce los eventos nativos del DOM a eventos de Vue.
 */
export const PaymentButton = defineComponent({
  name: 'PaymentButton',
  
  // 1. Define los props que acepta (camelCase)
  props: {
    apiKey: { type: String, required: true },
    amount: { type: Number, required: true },
    email: { type: String, required: true },
    productTitle: { type: String, required: false },
    lang: { type: String, required: false },
    disabled: { type: Boolean, required: false },
    loading: { type: Boolean, required: false },
    label: { type: String, required: false },
  },

  // 2. Define los eventos que emite (onSuccess -> @success)
  emits: ['success', 'error'],

  setup(props, { emit, slots }) {
    // 3. Crea una ref para el elemento del DOM
    const buttonRef = ref<HTMLElement | null>(null);

    // 4. Esconde la "fricción" de los eventos en onMounted
    onMounted(() => {
      const node = buttonRef.value;
      if (!node) return;

      // Escucha el evento del Web Component y lo "traduce" a un evento de Vue
      const handleSuccess = (event: Event) => {
        emit('success', (event as CustomEvent).detail);
      };
      const handleError = (event: Event) => {
        emit('error', (event as CustomEvent).detail);
      };

      node.addEventListener('success', handleSuccess);
      node.addEventListener('error', handleError);
      
      // (En Vue, los listeners se limpian automáticamente cuando el componente se desmonta)
    });

    // 5. Renderiza el Web Component
    return () => h(
      'payment-button',
      {
        // 6. Asigna la ref
        ref: buttonRef,
        
        // 7. Pasa los props, convirtiéndolos a kebab-case
        'api-key': props.apiKey,
        'amount': props.amount,
        'email': props.email,
        'productTitle': props.productTitle,
        'lang': props.lang,
        'disabled': props.disabled,
        'loading': props.loading,
        'label': props.label,
      },
      // 8. Pasa el contenido del slot (ej. "Pagar Ahora")
      slots.default ? slots.default() : []
    );
  },
});