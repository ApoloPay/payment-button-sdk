<script>
  import "@payment-button-sdk/ui";
  export let publicKey;
  export let amount;
</script>

<payment-button public-key={publicKey} {amount} on:success on:error>
  <slot />
</payment-button>
