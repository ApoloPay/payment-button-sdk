<script lang="ts">
  // 1. Importa el Web Component para registrarlo
  import "@payment-button-sdk/ui";
  import type { Locale, ApoloPayClient } from "@payment-button-sdk/ui";

  // 2. Define los props que el wrapper acepta
  export let client: ApoloPayClient | undefined = undefined;
  export let processId: string | undefined = undefined;
  export let metadata: Record<string, any> | undefined = undefined;
  export let productTitle: string | undefined = undefined;
  export let lang: Locale | undefined = undefined;
  export let disabled: boolean = false;
  export let loading: boolean = false;
  export let label: string | undefined = undefined;
  export let barrierDismissible: boolean = false;
</script>

<payment-button
  client={client}
  process-id={processId}
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
