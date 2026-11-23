# @nexora-smartpay/core

## 2.0.0

### Major Changes

- **Renamed to Nexora SmartPay**: This package is now published as `@nexora-smartpay/core` (previously `@apolopay-sdk/core`), with all internal workspace dependencies moved to the `@nexora-smartpay` scope. `ApoloPayClient` / `ApoloPayClientOptions` were renamed to `SmartPayClient` / `SmartPayClientOptions` (source file `smart-pay-client.ts`); the old names remain exported as deprecated aliases.
- **New default hosts, configurable per client**: `SmartPayClient` now talks to `https://api.smartpaylatam.com` / `https://ws.smartpaylatam.com` by default (previously `pb-api.apolopay.app` / `pb-ws.apolopay.app`). New optional `SmartPayClientOptions.apiUrl` / `socketUrl` override them per client and are read back with `getApiUrl()` / `getSocketUrl()`; only `https://` is accepted (`http://localhost` / `http://127.0.0.1` for local development), trailing slashes are trimmed, and an invalid value throws at construction. New exports `DEFAULT_API_URL`, `DEFAULT_SOCKET_URL`, `LEGACY_APOLO_API_URL` and `LEGACY_APOLO_SOCKET_URL` (the old Apolo hosts, still serving the same backend during the transition).
- **Host allowlist**: the client only accepts Nexora SmartPay hosts (`*.smartpaylatam.com`), Apolo Pay's legacy `pb-api`/`pb-ws.apolopay.app`, and `localhost`; any other host fails at construction.
- **Nexora visual identity (texts)**: the terms and disclaimer texts (es/en) now refer to Nexora instead of Apolo Pay. The consent line reads "He leído y acepto los Términos y Condiciones de Nexora." / "I have read and accept the Terms and Conditions of Nexora.", the rest of the sentence (wrong network / incomplete amount warning) is unchanged, and the gas-fee clause now says "to the payment address" / "hacia la dirección de pago".
- **QR generated locally**: `QrResponseData.qrCodeUrl` is now a locally generated SVG data URI (`data:image/svg+xml;...`, error correction H) instead of an `api.qrserver.com` URL, so deposit addresses are no longer sent to a third party and the QR no longer depends on that service being up. The encoded content (the payment address) is unchanged and the field keeps its name and type. New dependency `qrcode-generator` (2.0.4, pinned, no dependencies) and new export `generateQrCodeDataUri(data)`.
- **Request timeout**: `GET /payment-button/assets` and `POST /payment-button/process/confirm` are aborted after 10 s (`AbortController`) and surface the existing `ClientError` (`get_assets_error` / `qr_fetch_error`), so an unreachable host no longer leaves the button loading for 20+ s. In sandbox mode the offline catalog fallback now kicks in after at most 10 s.

## 1.4.0

### Minor Changes

- **Sandbox Mode**: Added a "Simulate partial payment" option to the sandbox picker, so both a full success and a partial payment can now be tested end-to-end. The sandbox flow now fetches the real (public) asset/network catalog for accurate icons — with an offline fallback if unreachable — while the QR/payment step and the WebSocket connection stay fully mocked and isolated from the real backend. Extracted a shared `APOLOPAY_NETWORK_ID` / `isApoloPayNetwork()` helper, replacing scattered `'apolopay'` string checks across the codebase.

  **Sandbox UI**: The "Test mode" badge is now a floating, non-interactive indicator anchored to the modal's top edge instead of taking up layout space. A new "Simulate payment" button and explanatory banner replace the "scan to pay" banner and network warnings while in sandbox mode. The QR code now encodes a placeholder message in sandbox mode instead of any (fake) payment data.

  **Bug Fix**: Fixed a bug where a simulated partial payment's `amount`/`amountPaid` could leak into the next QR or process instead of resetting — root cause was `if (qrData.amountPaid)` treating a legitimate `0` as "nothing to update". `resetState()` now also clears `amount`/`amountPaid`, and assigning a new `processId` now resets the whole session.

  **Testing**: Added a Vitest suite for `@apolopay-sdk/core` (services, types, i18n) and `@apolopay-sdk/ui` (sandbox/session-state regressions), now required to pass in CI before publishing.

## 1.3.0

### Minor Changes

- **Flexible Typings**: Updated interfaces (`QrResponseData`, `PaymentResponseData`, `PartialPaymentResponseData`) to support amounts in `string` or `number` format.

- **Internationalization**: New translations (EN/ES) for the payment system terms and conditions.

## 1.2.1

### Patch Changes

- **Reliability**: Enhanced WebSocket connection stability and error logging for transaction status monitoring.

## 1.2.0

### Patch Changes

- 5fc8f18: Event standardization and multi-framework integration improvements:

  - **Core & UI**: Consolidated `partialPayment` and `expired` event dispatching logic to ensure consistent behavior across all platforms and unified event names.
  - **React**: Refactored `ApoloPayButton` adapter to resolve a critical "Property vs Attribute" issue in React 18, ensuring the `client` object is correctly passed as a property. Added support for `onPartialPayment` and `onExpired` event props.
  - **Astro**: Fixed packaging configuration to ensure [.astro](cci:7://file:///c:/Users/detex/Downloads/apolo_button_demo/src/pages/index.astro:0:0-0:0) files and `src` folder are correctly included in the npm distribution.
  - **Vue, Svelte, and Angular**: Synchronized support for the `expired` and `partialPayment` events to maintain feature parity across the entire SDK.

## 1.1.0

### Minor Changes

- fix description

## 1.0.0

### Major Changes

- 220bf24: initial version
