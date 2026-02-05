# @apolopay-sdk/core

The core logic and common types for the Apolo Pay JavaScript SDK. This package provides the foundational classes and services used across all platform-specific SDKs (React, Vue, Angular, etc.).

## Installation

```bash
npm install @apolopay-sdk/core
# or
pnpm add @apolopay-sdk/core
# or
yarn add @apolopay-sdk/core
```

## Usage

### ApoloPayClient

The `ApoloPayClient` is the main entry point for interacting with the Apolo Pay API. You'll need your Public Key to initialize it.

```typescript
import { ApoloPayClient } from '@apolopay-sdk/core';

const client = new ApoloPayClient({
  publicKey: 'pk_test_...', // Your Apolo Pay Public Key
});
```

### Services and Types

This package also exports various types and services:

- `PaymentService`: Handles API calls for payments, assets, and WebSocket connections.
- `I18n`: Internationalization utility for the SDK.
- `Locale`: Type for supported languages ('es', 'en').
- `ClientResponse`, `ClientError`: Standardized response and error types.

## License

MIT
