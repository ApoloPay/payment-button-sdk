<script setup lang="ts">
import { PaymentButton } from '@payment-button-sdk/vue';
import '@payment-button-sdk/vue/style.css';

</script>

<template>
  <div>
    <h1>Mi Playground de Vue 💚</h1>
    <PaymentButton
      apiKey="pk_test_VUE_456"
      :amount="2500"
      currency="MXN"
    >
      Pagar 25.00 MXN
    </PaymentButton>
  </div>
</template>

<style scoped>
  div {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 50px;
  }
</style>