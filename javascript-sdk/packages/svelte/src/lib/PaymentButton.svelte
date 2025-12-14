<script lang="ts">
  // 1. Importa el Web Component para registrarlo
  import "@payment-button-sdk/ui";
  import type { Locale } from "@payment-button-sdk/ui";

  // 2. Define los props que el wrapper acepta
  export let publicKey: string;
  export let amount: number;
  export let metadata: Record<string, any> | undefined = undefined;
  export let productTitle: string | undefined = undefined;
  export let lang: Locale | undefined = undefined;
  export let disabled: boolean = false;
  export let loading: boolean = false;
  export let label: string | undefined = undefined;
  export let barrierDismissible: boolean = false;
</script>

<payment-button
  public-key={publicKey}
  {amount}
  {metadata}
  product-title={productTitle}
  {lang}
  {disabled}
  {loading}
  {label}
  barrier-dismissible={barrierDismissible}
  on:success
  on:error
>
  <slot />
</payment-button>
