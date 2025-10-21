<script>import "@payment-button-sdk/ui";
export let apiKey;
export let amount;
export let currency;
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