# @nexora-smartpay/vue

Vue wrapper for the Nexora SmartPay SDK. Provides a convenient component to integrate the Nexora SmartPay payment button into Vue 3 applications.

## Installation

```bash
npm install @nexora-smartpay/vue
# or
pnpm add @nexora-smartpay/vue
```

## Usage

```vue
<script setup lang="ts">
import { SmartPayButton, SmartPayClient, type ClientResponse, type ClientError } from '@nexora-smartpay/vue';

// 1. Initialize the client
const client = new SmartPayClient({
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
    <SmartPayButton
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

The `SmartPayButton` component accepts the same props as attributes (e.g., `:processId`, `:client`) and emits standard events (`@success`, `@error`).

For a full list of available properties, see the documentation for [@nexora-smartpay/ui](../ui/README.md).

## Migrating from `@apolopay-sdk/vue`

This package was previously published as `@apolopay-sdk/vue`. Replace the dependency with `@nexora-smartpay/vue`. `ApoloPayButton` and `ApoloPayClient` are still exported as deprecated aliases of `SmartPayButton` / `SmartPayClient`, so existing code keeps working after changing the import path.

## License

MIT
