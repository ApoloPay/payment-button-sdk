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
  static final client = SmartPayClient(publicKey: 'pk_test_...'); // Your Public Key

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Center(
        child: SmartPayButton(
          client: client,
          // The preorder id your server created with its secret key
          // (`POST /payment-button/process/preorder`); it carries the amount.
          processId: 'order_123...',
          onSuccess: (context, response) {
            print('Payment successful: ${response.message}');
          },
          onError: (context, error) {
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
  apiUrl: 'https://api.smartpaylatam.com', // Optional, this is the default
  socketUrl: 'https://ws.smartpaylatam.com', // Optional, this is the default
);

// ... then use in widget
SmartPayButton(
  client: client,
  processId: 'order_123',
  productTitle: 'Order #123', // Optional, shown in the payment modal
)
```

#### `SmartPayClient` parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `publicKey` | `String` (required) | - | Your merchant Public Key (`pk_test_...` enables sandbox mode). |
| `apiUrl` | `String?` | `defaultApiUrl` = `https://api.smartpaylatam.com` | REST API base URL. Exposed as `client.apiUrl` / `client.getApiUrl()`. |
| `socketUrl` | `String?` | `defaultSocketUrl` = `https://ws.smartpaylatam.com` | Realtime (Socket.IO) base URL. Exposed as `client.socketUrl` / `client.getSocketUrl()`. |

Only Nexora SmartPay hosts are accepted: `https://` on `smartpaylatam.com` or any of its subdomains (production, sandbox, testing), Apolo Pay's two legacy hosts (`pb-api.apolopay.app`, `pb-ws.apolopay.app`), and `localhost` / `127.0.0.1` (also over `http://`) for local development. Any other host, lookalikes included (`api.smartpaylatam.com.evil.com`), throws an `ArgumentError` from the constructor. Trailing slashes are trimmed.

**Transition from Apolo Pay hosts**: the same backend is still served on Apolo Pay's old hosts, exported as `legacyApoloApiUrl` (`https://pb-api.apolopay.app`) and `legacyApoloSocketUrl` (`https://pb-ws.apolopay.app`):

```dart
final client = SmartPayClient(
  publicKey: 'pk_...',
  apiUrl: legacyApoloApiUrl,
  socketUrl: legacyApoloSocketUrl,
);
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
