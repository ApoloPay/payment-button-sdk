<script lang="ts">
  // 1. Importa el Web Component para registrarlo
  import '@payment-button-sdk/ui';
  import type { Locale } from '@payment-button-sdk/ui';

  // 2. Define los props que el wrapper acepta
  export let apiKey: string;
  export let amount: number;
  export let email: string;
  export let productTitle: string | undefined = undefined;
  export let lang: Locale | undefined = undefined;
  export let disabled: boolean = false;
  export let loading: boolean = false;
  export let label: string | undefined = undefined;
  export let barrierDismissible: boolean = true;
</script>

<payment-button
  api-key={apiKey}
  amount={amount}
  email={email}
  product-title={productTitle}
  lang={lang}
  disabled={disabled}
  loading={loading}
  label={label}
  barrier-dismissible={barrierDismissible}
  on:success
  on:error
>
  <slot />
</payment-button>