---
"@apolopay-sdk/angular": major
"@apolopay-sdk/svelte": major
"@apolopay-sdk/astro": major
"@apolopay-sdk/react": major
"@apolopay-sdk/core": major
"@apolopay-sdk/vue": major
"@apolopay-sdk/ui": major
---

Event standardization and multi-framework integration improvements:

- **Core & UI**: Consolidated `partialPayment` and `expired` event dispatching logic to ensure consistent behavior across all platforms and unified event names.
- **React**: Refactored `ApoloPayButton` adapter to resolve a critical "Property vs Attribute" issue in React 18, ensuring the `client` object is correctly passed as a property. Added support for `onPartialPayment` and `onExpired` event props.
- **Astro**: Fixed packaging configuration to ensure [.astro](cci:7://file:///c:/Users/detex/Downloads/apolo_button_demo/src/pages/index.astro:0:0-0:0) files and `src` folder are correctly included in the npm distribution.
- **Vue, Svelte, and Angular**: Synchronized support for the `expired` and `partialPayment` events to maintain feature parity across the entire SDK.
