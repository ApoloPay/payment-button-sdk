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

#### Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `publicKey` | `string` | (required) | Your merchant Public Key (`pk_test_...` enables sandbox mode). |
| `apiUrl` | `string` (optional) | `DEFAULT_API_URL` = `https://api.smartpaylatam.com` | REST API base URL. Read it back with `client.getApiUrl()`. |
| `socketUrl` | `string` (optional) | `DEFAULT_SOCKET_URL` = `https://ws.smartpaylatam.com` | Realtime (Socket.IO) base URL. Read it back with `client.getSocketUrl()`. |

Only Nexora SmartPay hosts are accepted: `https://` on `smartpaylatam.com` or any of its subdomains (production, sandbox, testing), Apolo Pay's two legacy hosts (`pb-api.apolopay.app`, `pb-ws.apolopay.app`), and `localhost` / `127.0.0.1` (also over `http://`) for local development. Any other host, lookalikes included (`api.smartpaylatam.com.evil.com`), makes the constructor throw an `Error`. Trailing slashes are trimmed, so `getApiUrl()` / `getSocketUrl()` never end in `/`.

**Transition from Apolo Pay hosts**: the same backend is still served on Apolo Pay's old hosts, exported as `LEGACY_APOLO_API_URL` (`https://pb-api.apolopay.app`) and `LEGACY_APOLO_SOCKET_URL` (`https://pb-ws.apolopay.app`). To keep using them explicitly:

```typescript
import { SmartPayClient, LEGACY_APOLO_API_URL, LEGACY_APOLO_SOCKET_URL } from '@nexora-smartpay/core';

const client = new SmartPayClient({
  publicKey: 'pk_...',
  apiUrl: LEGACY_APOLO_API_URL,
  socketUrl: LEGACY_APOLO_SOCKET_URL,
});
```

### Services and Types

This package also exports various types and services:

- `PaymentService`: Handles API calls for payments, assets, and WebSocket connections.
- `I18n`: Internationalization utility for the SDK.
- `Locale`: Type for supported languages ('es', 'en').
- `ClientResponse`, `ClientError`: Standardized response and error types.
- `generateQrCodeDataUri(data)`: Generates a QR code locally as an SVG data URI. `QrResponseData.qrCodeUrl` is built with it, so the payment address is never sent to a third-party QR service.

## Migrating from `@apolopay-sdk/core`

This package was previously published as `@apolopay-sdk/core`. Replace the dependency with `@nexora-smartpay/core`. `ApoloPayClient` and `ApoloPayClientOptions` are still exported as deprecated aliases of `SmartPayClient` / `SmartPayClientOptions`, so existing code keeps working after changing the import path.

## License

MIT
