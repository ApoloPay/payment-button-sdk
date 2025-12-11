<script setup lang="ts">
// 1. Importa el componente y los tipos
import { PaymentButton, type PaymentResponse } from '@payment-button-sdk/vue';

// 2. Define los manejadores de eventos
const handleSuccess = (response: PaymentResponse) => {
  console.log('¡Pago recibido (Vue)!', response.transactionId);
  alert('¡Gracias por tu compra!');
};

const handleError = (error: any) => {
  console.error('Error (Vue):', error.message);
};
</script>

<template>
  <div>
    <h1>Mi Playground de Vue 💚</h1>

    <PaymentButton
      apiKey="pk_test_VUE_456"
      :amount="2500"
      email="test@apolopay.app"
      :barrierDismissible="false"
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