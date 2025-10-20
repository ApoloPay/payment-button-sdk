<script>import { PaymentClient } from "@payment-button-sdk/core";
import { createEventDispatcher } from "svelte";
export let apiKey;
export let amount;
export let currency;
let status = "idle";
const dispatch = createEventDispatcher();
const pay = () => {
  status = "loading";
  const client = new PaymentClient({
    apiKey,
    amount,
    currency,
    onSuccess: (response) => {
      status = "success";
      dispatch("success", response);
    },
    onError: (error) => {
      status = "error";
      dispatch("error", error);
    }
  });
  client.initiatePayment();
};
$: isDisabled = status === "loading";
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