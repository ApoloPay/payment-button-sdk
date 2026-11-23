# @nexora-smartpay/core

The core logic and common types for the Nexora SmartPay JavaScript SDK. This package provides the foundational classes and services used across all platform-specific SDKs (React, Vue, Angular, etc.).

## Installation

```bash
npm install @nexora-smartpay/core
# or
pnpm add @nexora-smartpay/core
# or
yarn add @nexora-smartpay/core
```

## Usage

### SmartPayClient

The `SmartPayClient` is the main entry point for interacting with the Nexora SmartPay API. You'll need your Public Key to initialize it.

```typescript
import { SmartPayClient } from '@nexora-smartpay/core';

const client = new SmartPayClient({
  publicKey: 'pk_test_...', // Your Public Key
});
```

### Services and Types

This package also exports various types and services:

- `PaymentService`: Handles API calls for payments, assets, and WebSocket connections.
- `I18n`: Internationalization utility for the SDK.
- `Locale`: Type for supported languages ('es', 'en').
- `ClientResponse`, `ClientError`: Standardized response and error types.

## Migrating from `@apolopay-sdk/core`

This package was previously published as `@apolopay-sdk/core`. Replace the dependency with `@nexora-smartpay/core`. `ApoloPayClient` and `ApoloPayClientOptions` are still exported as deprecated aliases of `SmartPayClient` / `SmartPayClientOptions`, so existing code keeps working after changing the import path.

## License

MIT
