# @apolopay-sdk/angular

## 1.2.0

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
