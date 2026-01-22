<script setup lang="ts">
// 1. Importa el componente y los tipos
import { PaymentButton, ApoloPayClient, type ClientResponse, type ClientError } from '@payment-button-sdk/vue';

// 2. Instancia el cliente de Apolo Pay
const client = new ApoloPayClient({
  publicKey: 'pk_test_VUE_456',
});

// 3. Define el proceso de pago
const processId = 'process_id_demo';

// 4. Define los manejadores de eventos
const handleSuccess = (response: ClientResponse) => {
  console.log('¡Pago recibido (Vue)!', response.message);
  alert('¡Gracias por tu compra!');
};

const handleError = (error: ClientError) => {
  console.error('Error (Vue):', error.message);
};
</script>

<template>
  <div>
    <h1>Mi Playground de Vue 💚</h1>

    <PaymentButton
      :client="client"
      :processId="processId"
      barrierDismissible
      @success="handleSuccess"
      @error="handleError"
    ></PaymentButton>
  </div>
</template>

<style scoped>
  div {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 50px;
  }
</style>