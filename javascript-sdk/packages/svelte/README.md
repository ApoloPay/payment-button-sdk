# @nexora-smartpay/svelte

Svelte wrapper for the Nexora SmartPay SDK. Provides a component to integrate the Nexora SmartPay payment button into Svelte applications.

## Installation

```bash
npm install @nexora-smartpay/svelte
# or
pnpm add @nexora-smartpay/svelte
```

## Usage

```html
<script lang="ts">
  import { SmartPayButton, SmartPayClient, type ClientResponse, type ClientError } from '@nexora-smartpay/svelte';

  // 1. Initialize the client
  const client = new SmartPayClient({
    publicKey: 'pk_test_...',
  });

  const processId = 'your-process-id';

  // 2. Event handlers
  function handleSuccess(event: CustomEvent<ClientResponse>) {
    console.log('Payment success!', event.detail);
  }

  function handleError(event: CustomEvent<ClientError>) {
    console.error('Payment error!', event.detail);
  }
</script>

<main>
  <h1>My Svelte Store</h1>

  <!-- 3. Use the component -->
  <SmartPayButton
    {client}
    {processId}
    productTitle="Order #SVELTE-1"
    lang="es"
    on:success={handleSuccess}
    on:error={handleError}
    barrierDismissible={true}
  />
</main>
```

## Props and Events

- `client`: (SmartPayClient) **Required**.
- `processId`: (string) **Required**.
- `productTitle`: (string)
- `lang`: ('es' | 'en')
- `label`: (string)
- `barrierDismissible`: (boolean)
- `on:success`: Fired on success.
- `on:error`: Fired on error.

## Migrating from `@apolopay-sdk/svelte`

This package was previously published as `@apolopay-sdk/svelte`. Replace the dependency with `@nexora-smartpay/svelte`. `ApoloPayButton` and `ApoloPayClient` are still exported as deprecated aliases of `SmartPayButton` / `SmartPayClient`, so existing code keeps working after changing the import path.

## License

MIT
