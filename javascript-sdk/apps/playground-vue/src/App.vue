<script setup lang="ts">
// 1. Importa el componente y los tipos
import { PaymentButton, type ClientResponse, type ClientError } from '@payment-button-sdk/vue';

// 2. Define los manejadores de eventos
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
      publicKey="pk_test_VUE_456"
      :amount="2500"
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