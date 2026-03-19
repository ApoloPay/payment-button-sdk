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
