<script>import "@payment-button-sdk/ui";
export let apiKey;
export let amount;
</script>

<payment-button
  api-key={apiKey}
  {amount}
  on:success
  on:error
>
  <slot />
</payment-button>