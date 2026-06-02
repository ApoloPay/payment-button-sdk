=== ApoloPay Checkout for WooCommerce ===
Contributors: apolopay
Tags: woocommerce, payments, apolopay, gateway, crypto, usdt, stablecoin
Requires at least: 5.0
Tested up to: 7.0
Stable tag: 1.2.0
Requires PHP: 7.4
Requires Plugins: woocommerce
License: GPLv2 or later
License URI: https://www.gnu.org/licenses/gpl-2.0.html

Official ApoloPay payment gateway for WooCommerce. Securely accept crypto payments (USDT) in your store using ApoloPay technology.

== Description ==

Accept payments with ease using the official ApoloPay integration for WooCommerce. This plugin provides a seamless checkout experience for stablecoin transactions (USDT).

= Key Features =
* **Secure Crypto Payments**: Integration with the ApoloPay SDK for high-security digital asset transactions.
* **WooCommerce Blocks Support**: Fully compatible with the modern WooCommerce Checkout and Cart blocks.
* **Real-time Notifications**: Webhook support to ensure order statuses are updated instantly upon payment confirmation.
* **Race-condition safe**: Handles edge cases where the ApoloPay webhook arrives before WooCommerce finishes creating the order.

== Installation ==

1. Upload the plugin files to the `/wp-content/plugins/apolopay-checkout-for-woocommerce` directory, or install the plugin through the WordPress plugins screen directly.
2. Activate the plugin through the 'Plugins' screen in WordPress.
3. Go to **WooCommerce > Settings > Payments** and enable **ApoloPay**.
4. Enter your Public Key, Secret Key, and Webhook Secret provided in your ApoloPay Dashboard.
5. Copy the Webhook URL from the settings page and add it to your ApoloPay developer settings.

== Frequently Asked Questions ==

= Does it support the new WooCommerce Checkout Block? =
Yes, the plugin is fully integrated with WooCommerce Blocks.

= Where can I find my API keys? =
You can find your Public and Secret keys in the ApoloPay Dashboard under the Payment Button settings.

= Where can I find the source code? =
The compiled `apolopay-sdk.js` file bundled with this plugin is built from our open-source JavaScript SDK monorepo. The unminified source code, build scripts, and full development history are publicly available at:

https://github.com/ApoloPay/payment-button-sdk

The repository also contains the source for `checkout.js` and `checkout-block.js` under `javascript-sdk/packages/wordpress/assets/`.

To build from source, run `turbo run build --filter=@apolo-pay/wordpress-plugin` from the monorepo root. Node.js and pnpm are required.

== External Services ==

This plugin communicates with the following external services. No personal customer data (name, address, email) is sent to any of them unless explicitly noted.

= ApoloPay Payment API =
Used to create payment sessions (preorders) when a customer initiates checkout.

* **Data sent**: Payment amount and an optional order metadata object.
* **When**: When the customer clicks "Place Order" on the checkout page.
* **Endpoint**: `https://pb-api.apolopay.app`
* **Privacy Policy**: https://apolopay.app/privacy
* **Terms of Service**: https://apolopay.app/terms

= ApoloPay WebSocket (real-time payment status) =
The ApoloPay SDK opens a WebSocket connection to the ApoloPay servers to receive real-time payment confirmation events. The SDK uses the Socket.IO client library internally; the connection goes to ApoloPay's own servers, not to socket.io.com.

* **Data sent**: The payment process ID, used to subscribe to status updates for that specific payment session.
* **When**: During an active payment session on the checkout page.
* **Provider**: ApoloPay
* **Privacy Policy**: https://apolopay.app/privacy
* **Terms of Service**: https://apolopay.app/terms

= QR Code Generation (api.qrserver.com by goQR.me) =
The ApoloPay SDK generates a QR code so that customers can scan the recipient crypto wallet address with a mobile wallet app. The QR image is requested from api.qrserver.com directly from the customer's browser.

* **Data sent**: The cryptocurrency wallet address (a public blockchain identifier — not linked to any personal user data).
* **When**: When the customer is shown the payment screen during checkout.
* **Provider**: goQR.me (api.qrserver.com)
* **API Documentation**: https://goqr.me/api/
* **Privacy & Security**: https://goqr.me/privacy-safety-security/
* **Legal Notice**: https://goqr.me/legal/

== Changelog ==

= 1.2.0 =
* Renamed plugin to "ApoloPay Checkout for WooCommerce" (new slug: apolopay-checkout-for-woocommerce).
* All PHP declarations, AJAX actions, script handles, and stored data now use the `apolopay_` prefix.
* Classes renamed to `ApoloPay_Gateway` and `ApoloPay_Blocks_Integration`.
* Added `Requires Plugins: woocommerce` header.
* Fixed: `apolopay-sdk.js` was not loaded in the WooCommerce Block checkout context.
* Fixed: sanitization applied to webhook event fields used in logs.
* Fixed: `set_transient` now stores a lightweight boolean flag instead of the raw payload array.
* Fixed: script handle `checkout` renamed to `apolopay-checkout` to avoid collisions.
* Added constants `APOLOPAY_PLUGIN_URL` / `APOLOPAY_PLUGIN_DIR` for clean path resolution.
* Documented all external services (ApoloPay API, ApoloPay WebSocket, goQR.me) in readme.
* Added source-code link and build instructions in readme.

= 1.1.0 =
* Initial public release.
* WooCommerce Classic and Block checkout support.
* HMAC-SHA256 webhook signature verification.
* Race-condition guard (transient) for webhooks arriving before the WC order is created.
* Idempotency guard to prevent double-processing the same payment.
