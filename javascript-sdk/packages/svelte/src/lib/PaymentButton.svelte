<script lang="ts">
  // 1. Importa el Web Component para registrarlo
  import '@payment-button-sdk/ui';

  // 2. Define los props que el wrapper acepta
  export let apiKey: string;
  export let amount: number;
  export let currency: string;
</script>

<payment-button
  api-key={apiKey}
  {amount}
  {currency}
  on:success
  on:error
>
  <slot />
</payment-button>