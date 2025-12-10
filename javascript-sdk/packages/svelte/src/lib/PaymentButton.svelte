<script lang="ts">
  // 1. Importa el Web Component para registrarlo
  import '@payment-button-sdk/ui';

  // 2. Define los props que el wrapper acepta
  export let apiKey: string;
  export let amount: number;
  export let disabled: boolean = false;
  export let loading: boolean = false;
  export let label: string | undefined = undefined;
</script>

<payment-button
  api-key={apiKey}
  {amount}
  {disabled}
  {loading}
  {label}
  on:success
  on:error
>
  <slot />
</payment-button>