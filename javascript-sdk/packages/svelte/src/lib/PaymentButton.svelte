<script lang="ts">
  // 1. Importa el Web Component para registrarlo
  import '@payment-button-sdk/ui';

  // 2. Define los props que el wrapper acepta
  export let apiKey: string;
  export let amount: number;
</script>

<payment-button
  api-key={apiKey}
  {amount}
  on:success
  on:error
>
  <slot />
</payment-button>