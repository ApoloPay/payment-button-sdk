=== Nexora SmartPay for WooCommerce ===
Contributors: apolopay
Tags: woocommerce, payments, nexora, smartpay, crypto, usdt, stablecoin
Requires at least: 5.0
Tested up to: 7.0
Stable tag: 2.0.0
Requires PHP: 7.4
Requires Plugins: woocommerce
License: GPLv2 or later
License URI: https://www.gnu.org/licenses/gpl-2.0.html

Official Nexora SmartPay payment gateway for WooCommerce. Securely accept stablecoin payments (USDT) in your store.

== Description ==

Accept stablecoin payments (USDT) in WooCommerce with the official Nexora SmartPay payment button. Customers pay from their crypto wallet by scanning a QR code at checkout, and the order is confirmed automatically by a signed webhook.

Nexora SmartPay is operated by Nexora (https://smartpaylatam.com).

= Key Features =
* **Secure Crypto Payments**: Built on the official Nexora SmartPay JavaScript SDK.
* **WooCommerce Blocks Support**: Compatible with the classic checkout and with the WooCommerce Checkout and Cart blocks.
* **Signed Webhooks**: Orders are confirmed only by webhooks signed with your Webhook Secret (HMAC-SHA256).
* **Race-condition safe**: Handles the case where the webhook arrives before WooCommerce finishes creating the order.
* **QR generated locally**: The payment QR code is generated in the customer's browser; no third-party QR service is contacted.

== Installation ==

1. Upload the plugin zip through **Plugins > Add New > Upload Plugin**, or upload the `apolopay-checkout-for-woocommerce` folder to `/wp-content/plugins/`.
2. Activate the plugin through the **Plugins** screen in WordPress.
3. Go to **WooCommerce > Settings > Payments** and open **Nexora SmartPay**.
4. Enter the Public Key and Secret Key from your Nexora SmartPay dashboard.
5. Copy the Webhook URL shown on the settings page into your Nexora SmartPay dashboard (Payment Button > Webhook), then paste the generated Webhook Secret into the plugin settings.
6. Enable the method. It is offered at checkout only once the Webhook Secret is set.

== Frequently Asked Questions ==

= Does it support the WooCommerce Checkout Block? =
Yes, the plugin works with both the classic checkout and the WooCommerce Checkout block.

= Where can I find my API keys? =
In your Nexora SmartPay dashboard, under the Payment Button settings.

= Why is Nexora SmartPay not shown at checkout? =
The method is hidden until the Webhook Secret is configured: without it no payment could be confirmed, so customers are never offered a payment that would leave the order on hold. An admin notice is shown while the method is enabled without a Webhook Secret.

= I am updating from ApoloPay Checkout for WooCommerce. Do I lose my settings? =
No. Version 2.0.0 is the same plugin (same folder and settings) under the Nexora SmartPay name. Your keys, webhook URL and orders are kept. If your checkout title or description still had the old default text, it is updated to the new default; customized texts are not changed. Set the Webhook Secret before updating (see the Upgrade Notice).

= Where can I find the source code? =
The compiled `nexora-smartpay.js` file bundled with this plugin is built from the open-source Nexora SmartPay SDK monorepo. The unminified source code, build scripts, and full development history are publicly available at:

https://github.com/Nexora-SmartPay/nexora_smartpay_sdk

The repository also contains the source for `checkout.js` and `checkout-block.js` under `javascript-sdk/packages/wordpress/assets/`.

To build from source, run `pnpm turbo run build --filter=@nexora-smartpay/wordpress-plugin` from the `javascript-sdk` folder of the monorepo. Node.js and pnpm are required.

== External Services ==

This plugin connects to the Nexora SmartPay services operated by Nexora. No personal customer data (name, address, email) is sent to them.

= Nexora SmartPay API (api.smartpaylatam.com) =
Used to create the payment session (preorder) when the customer places the order, and by the bundled SDK to load the available assets and networks and to confirm the payment session.

* **Data sent**: From your server: the order amount, an empty metadata object and your Secret Key. From the customer's browser: your Public Key, the payment process ID and the asset/network the customer selects.
* **When**: When the customer clicks "Place Order" with Nexora SmartPay selected, and while the payment window is open.
* **Endpoint**: `https://api.smartpaylatam.com`
* **Terms of Service**: https://smartpaylatam.com/terminos
* **Privacy Policy**: https://smartpaylatam.com/privacidad

= Nexora SmartPay real-time service (ws.smartpaylatam.com) =
The bundled SDK opens a Socket.IO connection from the customer's browser to receive the payment status in real time. The connection goes to Nexora SmartPay's own servers, not to socket.io.com.

* **Data sent**: Your Public Key and the payment process ID, used to subscribe to that payment's status.
* **When**: While the payment window is open during checkout.
* **Endpoint**: `https://ws.smartpaylatam.com`
* **Terms of Service**: https://smartpaylatam.com/terminos
* **Privacy Policy**: https://smartpaylatam.com/privacidad

The payment QR code is generated locally in the customer's browser; no QR service is contacted.

== Changelog ==

= 2.0.0 =
* Rebranded to Nexora SmartPay ("Nexora SmartPay for WooCommerce"). The plugin folder, settings, webhook URL and stored order data are unchanged, so it updates in place.
* The default checkout title is now "Nexora SmartPay". A title or description still equal to the previous default text is updated automatically; customized texts are kept.
* Webhook Secret is now required: without it the method is hidden at checkout and incoming webhooks are rejected with HTTP 401. Configure it BEFORE updating.
* The payment QR code is now generated locally; api.qrserver.com is no longer contacted.
* Payments are processed through the Nexora SmartPay API (api.smartpaylatam.com).
* Bundled Nexora SmartPay SDK 2.0.0 (`assets/nexora-smartpay.js`, script handle `nexora-smartpay-sdk`, element `<smartpay-button>`).
* New Nexora SmartPay icon.
* Fixed: the release zip now contains a single `apolopay-checkout-for-woocommerce/` folder, so every version installs over the same plugin.
* Fixed: a partial payment no longer leaves the checkout stuck. If the customer closes the payment window after paying only part of the amount, the checkout is unlocked with a notice, and the next "Place order" goes on paying the same payment (same session and cart total) instead of creating a new one. Only a complete payment is sent with the order.

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
* Documented all external services in readme.
* Added source-code link and build instructions in readme.

= 1.1.0 =
* Initial public release.
* WooCommerce Classic and Block checkout support.
* HMAC-SHA256 webhook signature verification.
* Race-condition guard (transient) for webhooks arriving before the WC order is created.
* Idempotency guard to prevent double-processing the same payment.

== Upgrade Notice ==

= 2.0.0 =
Set the Webhook Secret in WooCommerce > Settings > Payments > Nexora SmartPay BEFORE updating. From 2.0.0 the method is hidden at checkout and webhooks are rejected (401) without it. The plugin is now branded Nexora SmartPay; settings are kept.
