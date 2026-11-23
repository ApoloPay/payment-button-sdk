# @nexora-smartpay/astro

Astro integration for the Nexora SmartPay SDK. Provides a component to integrate the Nexora SmartPay payment button into Astro projects.

## Installation

```bash
npm install @nexora-smartpay/astro
# or
pnpm add @nexora-smartpay/astro
```

## Usage

```astro
---
import SmartPayButton from '@nexora-smartpay/astro/SmartPayButton.astro';
import { SmartPayClient } from '@nexora-smartpay/astro';

// 1. Initialize the client
const client = new SmartPayClient({
  publicKey: 'pk_test_...',
});

const processId = 'your-process-id';
---

<html>
  <body>
    <h1>My Astro Store</h1>

    <!-- 2. Use the component -->
    <SmartPayButton
      client={client}
      processId={processId}
      productTitle="Order #ASTRO-1"
      lang="es"
      client:load
    />
  </body>
</html>
```

## Props

- `client`: (SmartPayClient) **Required**.
- `processId`: (string) **Required**.
- `productTitle`: (string)
- `lang`: ('es' | 'en')
- `label`: (string)
- `barrierDismissible`: (boolean)

## Migrating from `@apolopay-sdk/astro`

This package was previously published as `@apolopay-sdk/astro`. Replace the dependency with `@nexora-smartpay/astro`. The component now lives at `@nexora-smartpay/astro/SmartPayButton.astro`; the old `@nexora-smartpay/astro/ApoloPayButton.astro` entry point is kept as a deprecated alias of the same component, and `ApoloPayClient` is still exported as a deprecated alias of `SmartPayClient`.

## License

MIT
