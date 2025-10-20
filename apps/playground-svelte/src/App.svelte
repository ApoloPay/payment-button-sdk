<script lang="ts">
  // 1. Importa el botón y los tipos
  import { PaymentButton, type PaymentResponse, type PaymentError } from '@payment-button-sdk/svelte';

  // 2. Manejadores de eventos
  function handleSuccess(event: CustomEvent<PaymentResponse>) {
    console.log('Pago exitoso (Svelte)!', event.detail.transactionId);
    alert('Pago exitoso: ' + event.detail.transactionId);
  }

  function handleError(event: CustomEvent<PaymentError>) {
    console.error('Error en el pago (Svelte):', event.detail.message);
    alert('Error: ' + event.detail.message);
  }
</script>

<main>
  <h1>Mi Playground de Svelte 🧡</h1>

  <PaymentButton
    apiKey="pk_test_SVELTE_789"
    amount={500}
    currency="USD"
    on:success={handleSuccess}
    on:error={handleError}
  >
    Pagar 5.00 USD
  </PaymentButton>
</main>

<style>
  main {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 50px;
    font-family: Arial, sans-serif;
  }
</style>