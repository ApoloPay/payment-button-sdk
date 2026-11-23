# Nexora SmartPay for WooCommerce

WooCommerce payment gateway for the Nexora SmartPay payment button (formerly "ApoloPay Checkout
for WooCommerce"). Customers pay in stablecoins (USDT) by scanning a QR code at checkout; the order
is confirmed by a signed webhook. Works with the classic checkout and the Checkout block.

The WordPress-facing description, changelog and external-services disclosure live in
[`readme.txt`](./readme.txt).

## Compatibility identifiers (do not rename)

Version 2.0.0 rebranded every visible string, but these identifiers are kept so existing stores
update in place without losing settings or orders:

| Identifier                  | Value                                     |
| :-------------------------- | :---------------------------------------- |
| Plugin folder / slug        | `apolopay-checkout-for-woocommerce`       |
| Main file                   | `apolo-pay.php`                           |
| Text domain                 | `apolopay-checkout-for-woocommerce`       |
| Gateway id                  | `apolo_pay` (option `woocommerce_apolo_pay_settings`) |
| Webhook endpoint            | `/?wc-api=apolo_pay_webhook`              |
| AJAX action                 | `apolopay_create_process`                 |
| Order meta                  | `_apolo_process_id`                       |
| PHP classes / constants     | `ApoloPay_Gateway`, `ApoloPay_Blocks_Integration`, `APOLOPAY_*` |

## Build

From the `javascript-sdk` folder of the monorepo:

```bash
pnpm install --frozen-lockfile
pnpm turbo run build --filter=@nexora-smartpay/wordpress-plugin
```

The build:

1. Builds `@nexora-smartpay/ui` and copies its UMD bundle to `assets/nexora-smartpay.js`
   (`scripts/copy-build.js`). The bundle is committed, so commit it after rebuilding.
2. Stages the plugin into `dist/apolopay-checkout-for-woocommerce/` and zips it to
   `dist/apolopay-checkout-for-woocommerce.zip` (`scripts/package-zip.js`).

The zip contains a single top-level `apolopay-checkout-for-woocommerce/` folder. WordPress installs
a plugin zip into the folder found inside it, so the zip can be renamed (the release workflow adds
the version to the file name) and still installs over the same plugin.

## Install

1. In WordPress, go to **Plugins > Add New > Upload Plugin** and upload the zip. When updating,
   choose **Replace current with uploaded**.
2. Activate the plugin and open **WooCommerce > Settings > Payments > Nexora SmartPay**.
3. Enter the Public Key and Secret Key from your Nexora SmartPay dashboard.
4. Copy the Webhook URL shown on the settings page into the dashboard (Payment Button > Webhook)
   and paste the generated Webhook Secret into the plugin.

The method is hidden at checkout until the Webhook Secret is set, and webhooks are rejected
(HTTP 401) without it.

## Webhook endpoint

`POST https://<your-store>/?wc-api=apolo_pay_webhook`

- Headers: `X-Signature: <hex HMAC-SHA256 of the raw body, keyed with the Webhook Secret>`
  (required), `X-Timestamp: <timestamp>` (logged), `Content-Type: application/json`.
- Body (JSON), either shape:
  - `{ "id": string, "status": "completed", "metadata"?: { "orderId"?: number } }`
  - `{ "processId": string, "event": "payment.completed", "metadata"?: { "orderId"?: number } }`
- Responses: `200 {"received": true}` when processed (or stored as pending if the order doesn't
  exist yet); `200` plain text for ignored events/statuses; `400` for invalid JSON, an unknown
  shape or a missing process ID; `401` for a missing secret, missing signature or invalid
  signature.

## Services contacted

- `POST https://api.smartpaylatam.com/payment-button/process/preorder` from the store server,
  headers `Content-Type: application/json`, `x-secret-key: <Secret Key>`, body
  `{ "amount": number, "metadata": {} }`; the plugin reads `result.id` (string) from the response
  as the process ID.
- `api.smartpaylatam.com` and `ws.smartpaylatam.com` from the customer's browser, through the
  bundled SDK with its default hosts.

The QR code is generated locally in the browser.

## License

GPLv2 or later
