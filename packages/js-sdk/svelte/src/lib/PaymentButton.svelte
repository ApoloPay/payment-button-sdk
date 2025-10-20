<script lang="ts">
  import { PaymentClient, type PaymentOptions, type PaymentResponse, type PaymentError } from '@payment-button-sdk/core';
  import { createEventDispatcher } from 'svelte';

  // 1. Props (así se definen en Svelte)
  export let apiKey: string;
  export let amount: number;
  export let currency: string;

  // 2. Estado interno
  let status: 'idle' | 'loading' | 'success' | 'error' = 'idle';

  // 3. Emisor de eventos (para on:success y on:error)
  const dispatch = createEventDispatcher();

  const pay = () => {
    status = 'loading';
    const client = new PaymentClient({
      apiKey,
      amount,
      currency,
      onSuccess: (response: PaymentResponse) => {
        status = 'success';
        dispatch('success', response); // Emite un evento 'success'
      },
      onError: (error: PaymentError) => {
        status = 'error';
        dispatch('error', error); // Emite un evento 'error'
      },
    });
    client.initiatePayment();
  };

  // 4. Propiedad computada (se recalcula si 'status' cambia)
  $: isDisabled = status === 'loading';
</script>

<style>
  .payment-button-svelte {
    background-color: #ff3e00; /* Svelte Orange */
    color: white;
    padding: 10px 15px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-weight: bold;
  }
  .payment-button-svelte:disabled {
    background-color: #a1a1a1;
    cursor: not-allowed;
  }
</style>

<button class="payment-button-svelte" on:click={pay} disabled={isDisabled}>
  {#if status === 'loading'}
    Procesando...
  {:else}
    <slot>Pagar con Svelte</slot>
  {/if}
</button>