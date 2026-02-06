# Apolo Pay SDK Mono-Repository

Welcome to the official repository for **Apolo Pay SDKs**. This repository contains the source code, documentation, and tools for integrating Apolo Pay into your applications across different platforms.

## Repository Structure

This is a mono-repository organized by platform:

- [**`javascript-sdk/`**](./javascript-sdk): Contains the JavaScript/TypeScript SDK and adapters for modern web frameworks (React, Vue, Angular, Svelte, Astro).
- [**`dart_sdk/`**](./dart_sdk): Contains the Flutter/Dart SDK for mobile and cross-platform application development.

## Getting Started

To get started with Apolo Pay, you will need a **Public Key**, which you can obtain from your [Apolo Pay Dashboard](https://www.apolopay.app).

### 🌐 Web (JavaScript/TypeScript)

If you are building for the web, go to the [`javascript-sdk`](./javascript-sdk) directory for installation instructions for your favorite framework.

```bash
# Example for Core JS
npm install @apolopay-sdk/core
```

### 📱 Mobile (Flutter/Dart)

If you are building a Flutter app, go to the [`dart_sdk`](./dart_sdk) directory.

```bash
# Add to your Flutter project
flutter pub add apolopay_sdk
```

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
