# @apolopay-sdk/vue

Vue wrapper for the Apolo Pay SDK. Provides a convenient component to integrate the Apolo Pay payment button into Vue 3 applications.

## Installation

```bash
npm install @apolopay-sdk/vue
# or
pnpm add @apolopay-sdk/vue
```

## Usage

```vue
<script setup lang="ts">
import { ApoloPayButton, ApoloPayClient, type ClientResponse, type ClientError } from '@apolopay-sdk/vue';

// 1. Initialize the client
const client = new ApoloPayClient({
  publicKey: 'pk_test_...',
});

const processId = 'your-process-id';

// 2. Define event handlers
const handleSuccess = (response: ClientResponse) => {
  console.log('Payment successful!', response.message);
};

const handleError = (error: ClientError) => {
  console.error('Payment error:', error.message);
};
</script>

<template>
  <div class="container">
    <h1>My Store</h1>
    
    <!-- 3. Use the component -->
    <ApoloPayButton
      :client="client"
      :processId="processId"
      productTitle="Order #VUE-1"
      lang="es"
      @success="handleSuccess"
      @error="handleError"
      barrierDismissible
    />
  </div>
</template>
```

## Props and Events

The `ApoloPayButton` component accepts the same props as attributes (e.g., `:processId`, `:client`) and emits standard events (`@success`, `@error`).

For a full list of available properties, see the documentation for [@apolopay-sdk/ui](../ui/README.md).

## License

MIT
