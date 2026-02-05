# @apolopay-sdk/svelte

Svelte wrapper for the Apolo Pay SDK. Provides a component to integrate the Apolo Pay payment button into Svelte applications.

## Installation

```bash
npm install @apolopay-sdk/svelte
# or
pnpm add @apolopay-sdk/svelte
```

## Usage

```html
<script lang="ts">
  import { ApoloPayButton, ApoloPayClient, type ClientResponse, type ClientError } from '@apolopay-sdk/svelte';

  // 1. Initialize the client
  const client = new ApoloPayClient({
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
  <ApoloPayButton
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

- `client`: (ApoloPayClient) **Required**.
- `processId`: (string) **Required**.
- `productTitle`: (string)
- `lang`: ('es' | 'en')
- `label`: (string)
- `barrierDismissible`: (boolean)
- `on:success`: Fired on success.
- `on:error`: Fired on error.

## License

MIT
