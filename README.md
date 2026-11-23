# Nexora SmartPay SDK Mono-Repository

Welcome to the official repository for **Nexora SmartPay SDKs**. This repository contains the source code, documentation, and tools for integrating Nexora SmartPay into your applications across different platforms.

## Repository Structure

This is a mono-repository organized by platform:

- [**`javascript-sdk/`**](./javascript-sdk): Contains the JavaScript/TypeScript SDK and adapters for modern web frameworks (React, Vue, Angular, Svelte, Astro).
- [**`dart_sdk/`**](./dart_sdk): Contains the Flutter/Dart SDK for mobile and cross-platform application development.

## Getting Started

To get started with Nexora SmartPay, you will need a **Public Key**, which you can obtain from your [merchant dashboard](https://www.apolopay.app).

### 🌐 Web (JavaScript/TypeScript)

If you are building for the web, go to the [`javascript-sdk`](./javascript-sdk) directory for installation instructions for your favorite framework.

```bash
# Example for Core JS
npm install @nexora-smartpay/core
```

### 📱 Mobile (Flutter/Dart)

If you are building a Flutter app, go to the [`dart_sdk`](./dart_sdk) directory.

```bash
# Add to your Flutter project
flutter pub add nexora_smartpay_sdk
```

## Migrating from Apolo Pay SDK

Version 2.0.0 renames the SDKs: the npm packages moved from `@apolopay-sdk/*` to `@nexora-smartpay/*` and the Flutter package from `apolopay_sdk` to `nexora_smartpay_sdk`. Public names changed from `ApoloPay*` to `SmartPay*` (and `<apolopay-button>` to `<smartpay-button>`), but the old names are still exported as deprecated aliases so existing integrations keep working. See the [JavaScript](./javascript-sdk#migrating-from-apolopay-sdk) and [Flutter](./dart_sdk#migrating-from-apolopay_sdk) READMEs for details.

## Continuous Integration and Deployment

This repository uses **GitHub Actions** with **Trusted Publishing** to ensure secure and automated releases:

- **NPM**: Releases are triggered by merging into the `deploy/javascript` branch.
- **Pub.dev**: Releases are triggered by merging into the `deploy/dart` branch.

## Documentation

For full documentation on APIs, integration guides, and best practices, please visit our documentation portal:

👉 [**docs.apolopay.app**](https://docs.apolopay.app)

## Contributing

We welcome contributions! Please refer to the specific SDK directories for development guides and ways to contribute code, report bugs, or request features.

## License

All packages in this repository are licensed under the [MIT License](./dart_sdk/LICENSE).
