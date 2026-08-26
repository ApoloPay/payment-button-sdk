# @apolopay-sdk/astro

## 1.3.0

### Minor Changes

- **Sandbox Mode**: Added a "Simulate partial payment" option to the sandbox picker, so both a full success and a partial payment can now be tested end-to-end. The sandbox flow now fetches the real (public) asset/network catalog for accurate icons — with an offline fallback if unreachable — while the QR/payment step and the WebSocket connection stay fully mocked and isolated from the real backend. Extracted a shared `APOLOPAY_NETWORK_ID` / `isApoloPayNetwork()` helper, replacing scattered `'apolopay'` string checks across the codebase.

  **Sandbox UI**: The "Test mode" badge is now a floating, non-interactive indicator anchored to the modal's top edge instead of taking up layout space. A new "Simulate payment" button and explanatory banner replace the "scan to pay" banner and network warnings while in sandbox mode. The QR code now encodes a placeholder message in sandbox mode instead of any (fake) payment data.

  **Bug Fix**: Fixed a bug where a simulated partial payment's `amount`/`amountPaid` could leak into the next QR or process instead of resetting — root cause was `if (qrData.amountPaid)` treating a legitimate `0` as "nothing to update". `resetState()` now also clears `amount`/`amountPaid`, and assigning a new `processId` now resets the whole session.

  **Testing**: Added a Vitest suite for `@apolopay-sdk/core` (services, types, i18n) and `@apolopay-sdk/ui` (sandbox/session-state regressions), now required to pass in CI before publishing.

### Patch Changes

- Updated dependencies
  - @apolopay-sdk/ui@1.4.0

## 1.2.3

### Patch Changes

- fix: include ApoloPayButton.astro in published package

## 1.2.2

### Patch Changes

- Updated dependencies
  - @apolopay-sdk/ui@1.3.0

## 1.2.1

### Patch Changes

- @apolopay-sdk/ui@1.2.1

## 1.1.0

### Patch Changes

- 5fc8f18: Event standardization and multi-framework integration improvements:

  - **Core & UI**: Consolidated `partialPayment` and `expired` event dispatching logic to ensure consistent behavior across all platforms and unified event names.
  - **React**: Refactored `ApoloPayButton` adapter to resolve a critical "Property vs Attribute" issue in React 18, ensuring the `client` object is correctly passed as a property. Added support for `onPartialPayment` and `onExpired` event props.
  - **Astro**: Fixed packaging configuration to ensure [.astro](cci:7://file:///c:/Users/detex/Downloads/apolo_button_demo/src/pages/index.astro:0:0-0:0) files and `src` folder are correctly included in the npm distribution.
  - **Vue, Svelte, and Angular**: Synchronized support for the `expired` and `partialPayment` events to maintain feature parity across the entire SDK.

### Patch Changes

- Updated dependencies [5fc8f18]
  - @apolopay-sdk/ui@2.0.0

## 1.1.0

### Minor Changes

- fix description

### Patch Changes

- Updated dependencies
  - @apolopay-sdk/ui@1.1.0

## 1.0.0

### Major Changes

- 220bf24: initial version

### Patch Changes

- Updated dependencies [220bf24]
  - @apolopay-sdk/ui@1.0.0
