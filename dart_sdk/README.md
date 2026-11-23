# nexora_smartpay_sdk

The official Flutter SDK for integrating the Nexora SmartPay payment button into your mobile applications. Provide a seamless and secure payment experience for your users with a few lines of code.

## Features

- **Ready-to-use Payment Button**: A highly customizable and responsive payment widget.
- **Secure Transactions**: Built-in security and transaction verification.
- **Multiple Assets Support**: Display and handle payments for various cryptocurrencies and assets.
- **I18n Support**: Full support for English and Spanish locales.
- **Real-time Updates**: WebSocket integration for instant payment status updates.

## Installation

Add the dependency to your `pubspec.yaml` or run:

```bash
flutter pub add nexora_smartpay_sdk
```

## Getting Started

To use this SDK, you must have an active merchant account and a **Public Key**. You can find your keys in your merchant dashboard.

## Usage

### Simple Usage

The easiest way to integrate Nexora SmartPay is using the `SmartPayButton` widget.

```dart
import 'package:nexora_smartpay_sdk/nexora_smartpay_sdk.dart';
import 'package:flutter/material.dart';

class MyPaymentScreen extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Center(
        child: SmartPayButton(
          publicKey: 'pk_test_...', // Your Public Key
          processId: 'order_123...', // Your unique order/process ID
          amount: 100.0,             // Amount to charge
          onSuccess: (transaction) {
            print('Payment successful: ${transaction.id}');
          },
          onError: (error) {
            print('Payment error: ${error.message}');
          },
        ),
      ),
    );
  }
}
```

### Advanced Configuration

You can customize the look and behavior of the button and the payment client:

```dart
final client = SmartPayClient(
  publicKey: 'pk_test_...',
  baseUrl: 'https://api.apolopay.app', // Optional custom base URL
);

// ... then use in widget
SmartPayButton(
  client: client,
  processId: 'order_123',
  amount: 50.0,
  isTest: true, // Enable test mode if needed
)
```

## Migrating from `apolopay_sdk`

Version 2.0.0 renames the package from `apolopay_sdk` to `nexora_smartpay_sdk` and the public classes from `ApoloPay*` to `SmartPay*`:

| Before (`apolopay_sdk` 1.x) | Now (`nexora_smartpay_sdk` 2.x) |
| --- | --- |
| `package:apolopay_sdk/apolopay_sdk.dart` | `package:nexora_smartpay_sdk/nexora_smartpay_sdk.dart` |
| `ApoloPayClient` | `SmartPayClient` |
| `ApoloPayButton` | `SmartPayButton` |
| `ApoloPayOptions` | `SmartPayOptions` |
| `ApoloPayService` | `SmartPayService` |

The old class names still work: they are exported as deprecated typedefs of the new classes, so after switching the dependency and the import, existing code keeps compiling (with deprecation hints). They will be removed in a future major version.

## Additional Information

For more information, visit the [Documentation](https://docs.apolopay.app).

- **Filing issues**: Use the [GitHub issue tracker](https://github.com/Nexora-SmartPay/nexora_smartpay_sdk/issues).
- **Contributing**: Pull requests are welcome!

## License

MIT
