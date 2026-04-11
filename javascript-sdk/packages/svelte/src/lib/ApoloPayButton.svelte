<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  // 1. Importa el Web Component para registrarlo
  import "@apolopay-sdk/ui";
  import type { 
    Locale, 
    ApoloPayClient, 
    ClientResponse, 
    ClientError, 
    PartialPaymentResponseData 
  } from "@apolopay-sdk/ui";

  // 2. Define los props que el wrapper acepta
  export let client: ApoloPayClient | undefined = undefined;
  export let processId: string | undefined = undefined;
  export let productTitle: string | undefined = undefined;
  export let lang: Locale | undefined = undefined;
  export let disabled: boolean = false;
  export let loading: boolean = false;
  export let label: string | undefined = undefined;
  export let barrierDismissible: boolean = false;

  // 2.1 Callbacks (opcionales) para recibir los datos directamente
  export let onSuccess: ((res: ClientResponse) => void) | undefined = undefined;
  export let onPartialPayment: ((res: ClientResponse<PartialPaymentResponseData>) => void) | undefined = undefined;
  export let onError: ((err: ClientError) => void) | undefined = undefined;
  export let onExpired: ((err: ClientError) => void) | undefined = undefined;
  export let onDismissed: (() => void) | undefined = undefined;

  // 3. Define el despachador de eventos con tipos formales
  const dispatch = createEventDispatcher<{
    success: ClientResponse;
    partialPayment: ClientResponse<PartialPaymentResponseData>;
    error: ClientError;
    expired: ClientError;
    dismissed: void;
  }>();

  // 4. Manejadores para re-despachar eventos con sus tipos
  function handleSuccess(e: CustomEvent<ClientResponse>) {
    dispatch('success', e.detail);
    onSuccess?.(e.detail);
  }

  function handlePartialPayment(e: CustomEvent<ClientResponse<PartialPaymentResponseData>>) {
    dispatch('partialPayment', e.detail);
    onPartialPayment?.(e.detail);
  }

  function handleError(e: CustomEvent<ClientError>) {
    dispatch('error', e.detail);
    onError?.(e.detail);
  }

  function handleExpired(e: CustomEvent<ClientError>) {
    dispatch('expired', e.detail);
    onExpired?.(e.detail);
  }

  function handleDismissed() {
    dispatch('dismissed');
    onDismissed?.();
  }
</script>

<apolopay-button
  client={client}
  process-id={processId}
  product-title={productTitle}
  {lang}
  {disabled}
  {loading}
  {label}
  barrier-dismissible={barrierDismissible}
  on:success={handleSuccess}
  on:partialPayment={handlePartialPayment}
  on:error={handleError}
  on:expired={handleExpired}
  on:dismissed={handleDismissed}
>
  <slot />
</apolopay-button>
