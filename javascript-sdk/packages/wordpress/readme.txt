=== Apolo Pay for WooCommerce ===
Contributors: apolopay
Tags: woocommerce, payments, apolo pay, gateway, crypto, usdt
Requires at least: 5.0
Tested up to: 6.5
Stable tag: 1.1.0
Requires PHP: 7.4
License: GPLv2 or later
License URI: https://www.gnu.org/licenses/gpl-2.0.html

Official Apolo Pay payment gateway for WooCommerce. Securely accept crypto payments (USDT) in your store using Apolo Pay technology.

== Description ==

Accept payments with ease using the official Apolo Pay integration for WooCommerce. This plugin provides a seamless checkout experience for stablecoin transactions (USDT).

= Key Features =
* **Secure Crypto Payments**: Integration with Apolo Pay SDK for high-security standards in digital asset transactions.
* **WooCommerce Blocks Support**: Fully compatible with the modern WooCommerce Checkout and Cart blocks.
* **Real-time Notifications**: Webhook support to ensure order statuses are updated instantly upon payment confirmation.

== Installation ==

1. Upload the plugin files to the `/wp-content/plugins/apolo-pay-for-woocommerce` directory, or install the plugin through the WordPress plugins screen directly.
2. Activate the plugin through the 'Plugins' screen in WordPress.
3. Go to **WooCommerce > Settings > Payments** and enable **Apolo Pay**.
4. Enter your Public Key, Secret Key, and Webhook Secret provided in your Apolo Pay Dashboard.
5. Copy the Webhook URL from the settings page and add it to your Apolo Pay developer settings.

== Frequently Asked Questions ==

= Does it support the new WooCommerce Checkout Block? =
Yes, the plugin is fully integrated with the new WooCommerce Blocks system.

= Where can I find my API keys? =
You can find your Public and Secret keys in the Apolo Pay Dashboard under the Payment Button settings.

== Screenshots ==

1. Apolo Pay settings in WooCommerce.
2. Checkout page showing Apolo Pay as a payment method.
3. The Apolo Pay payment modal in action.

== Changelog ==

= 1.1.0 =
* Initial release on the WordPress.org repository.
* Added support for WooCommerce Blocks.
* Improved webhook security with signature verification.

== Development and Source Code ==

The compiled `apolopay-sdk.js` file used in this plugin is built from our open-source SDK. You can find the unminified source code, build tools, and contribute to the development on our public GitHub repository:
https://github.com/ApoloPay/payment-button-sdk