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

