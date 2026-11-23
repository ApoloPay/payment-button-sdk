## 1.0.0

* Initial release of the Apolo Pay SDK for Flutter.
* Support for payment button integration.
* Secure transaction processing.

## 1.1.0

*   **i18n**: Major localization updates for Spanish, adding new translations for the payment modal (asset selection, network selection, success, and error states).
*   **Event Handling**: Synchronized event logic with the JS SDK to provide consistent `onSuccess`, `onPartialPayment`, and `onError` callbacks.
*   **Web Component Integration**: Internal improvements to the custom element bridge for better compatibility with the latest `<apolopay-button>`.
*   **Reliability**: Enhanced WebSocket connection stability and error logging for transaction status monitoring.
*   **Styling**: Updated default theme and styles to match the latest design system of the checkout modal.

## 1.1.1

*   **Reliability**: Enhanced WebSocket connection stability and error logging for transaction status monitoring.

## 1.2.0

*   **Disclaimer Modals**: Implemented the `InfoModal` component to show mandatory terms and conditions and network-specific warnings.
*   **Rich Text Support**: Added a utility to render HTML-like tags (bold, highlight, line breaks) within the UI for better message formatting.
*   **Improved Amount Handling**: Enhanced precision when processing `amount` and `amountPaid` values, ensuring they are correctly handled as doubles.
*   **New Processing State**: Introduced a dedicated UI state for when a payment is being processed, improving user feedback.
*   **Event Synchronization**: Updated modal navigation logic to ensure events are dispatched only when the modal is fully closed, matching the JS SDK behavior.

*   **Sandbox Mode**: Added a "Simulate partial payment" option to the sandbox picker, alongside success/error/expired. The sandbox flow now fetches the real (public) asset/network catalog for accurate icons — with an offline fallback if unreachable — while the QR/payment step and the WebSocket connection stay fully mocked and isolated from the real backend.
*   **Sandbox UI**: The "Modo prueba" badge is now a floating, non-interactive indicator anchored to the modal's top edge instead of taking up layout space. A new "Simular pago" button and explanatory banner replace the "scan to pay" banner and network warnings while in sandbox mode. The QR code now encodes a placeholder message in sandbox mode instead of any (fake) payment data.
*   **Bug Fix**: Fixed a bug where a simulated partial payment result could leak into the next QR or process instead of resetting when a new network was selected or a new `processId` was assigned.
*   **Bug Fix**: `ApoloPayButton` no longer rejects valid sandbox (`pk_test_...`) keys of non-standard length, matching the JS SDK's validation behavior.
*   **Refactor**: Extracted a shared `Network.apolopayNetworkId` / `isApoloPay` helper, replacing scattered `'apolopay'` string checks.
*   **Testing**: Added a `flutter_test` suite covering sandbox service isolation, network helpers, and button config validation.


## 2.0.0

*   **BREAKING – Renamed to Nexora SmartPay**: The package is now published as `nexora_smartpay_sdk` (previously `apolopay_sdk`), with the main library at `package:nexora_smartpay_sdk/nexora_smartpay_sdk.dart`. Public classes were renamed from `ApoloPay*` to `SmartPay*` (`SmartPayClient`, `SmartPayButton`, `SmartPayOptions`, `SmartPayService`) and their source files moved accordingly (`smart_pay_client.dart`, `smartpay_button.dart`, `smartpay_models.dart`, `smartpay_service.dart`, `smartpay_modal.dart`).
*   **Backwards compatibility**: The old names `ApoloPayClient`, `ApoloPayButton`, `ApoloPayOptions` and `ApoloPayService` are still exported as `@Deprecated` typedefs of the new classes, so existing code only needs the new dependency and import path. They will be removed in a future major version.
*   **BREAKING – New default hosts, configurable per client**: `SmartPayClient` now talks to `https://api.smartpaylatam.com` / `https://ws.smartpaylatam.com` by default (previously `pb-api.apolopay.app` / `pb-ws.apolopay.app`). New optional `apiUrl` / `socketUrl` constructor parameters (also exposed as `apiUrl`/`socketUrl` fields and `getApiUrl()`/`getSocketUrl()`) override them per client; only `https://` is accepted (`http://localhost` / `http://127.0.0.1` for local development), trailing slashes are trimmed, and an invalid value throws `ArgumentError`. New exported constants `defaultApiUrl`, `defaultSocketUrl`, `legacyApoloApiUrl` and `legacyApoloSocketUrl` (the old Apolo hosts, still serving the same backend during the transition).
