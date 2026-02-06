# apolopay_sdk

The official Flutter SDK for integrating Apolo Pay's payment button into your mobile applications. Provide a seamless and secure payment experience for your users with a few lines of code.

## Features

- **Ready-to-use Payment Button**: A highly customizable and responsive payment widget.
- **Secure Transactions**: Built-in security and transaction verification.
- **Multiple Assets Support**: Display and handle payments for various cryptocurrencies and assets.
- **I18n Support**: Full support for English and Spanish locales.
- **Real-time Updates**: WebSocket integration for instant payment status updates.

## Installation

Add several dependencies to your `pubspec.yaml` or run:

```bash
flutter pub add apolopay_sdk
```

## Getting Started

To use this SDK, you must have an active Apolo Pay account and a **Public Key**. You can find your keys in the Apolo Pay dashboard.

## Usage

### Simple Usage

The easiest way to integrate Apolo Pay is using the `ApoloPayButton` widget.

```dart
import 'package:apolopay_sdk/apolopay_sdk.dart';
import 'package:flutter/material.dart';

class MyPaymentScreen extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Center(
        child: ApoloPayButton(
          publicKey: 'pk_test_...', // Your Apolo Pay Public Key
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
final client = ApoloPayClient(
  publicKey: 'pk_test_...',
  baseUrl: 'https://api.apolopay.app', // Optional custom base URL
);

// ... then use in widget
ApoloPayButton(
  client: client,
  processId: 'order_123',
  amount: 50.0,
  isTest: true, // Enable test mode if needed
)
```

## Additional Information

For more information, visit the [Apolo Pay Documentation](https://docs.apolopay.app).

- **Filing issues**: Use the [GitHub issue tracker](https://github.com/ApoloPay/payment-button-sdk/issues).
- **Contributing**: Pull requests are welcome!

## License

MIT
