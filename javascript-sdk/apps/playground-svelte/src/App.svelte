<script lang="ts">
  // 1. Importa el componente y los tipos
  import { 
    PaymentButton,
  } from '@payment-button-sdk/svelte';

  // 2. Define los manejadores de eventos
  //    (Nota: 'event' es un CustomEvent, 'event.detail' tiene los datos)
  function handleSuccess(event: any) {
    console.log('¡Pago exitoso (Svelte)!', event.detail.transactionId);
    alert('Pago exitoso: ' + event.detail.transactionId);
  }

  function handleError(event: any) {
    console.error('Error en el pago (Svelte):', event.detail.message);
    alert('Error: ' + event.detail.message);
  }
</script>

<main>
  <h1>Mi Playground de Svelte 🧡</h1>

  <PaymentButton
    apiKey="pk_test_SVELTE_789"
    amount={500}
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
    padding: 50px;
    font-family: Arial, sans-serif;
  }
</style>