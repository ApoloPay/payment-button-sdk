# @nexora-smartpay/ui

The UI components for Nexora SmartPay, built with Lit (Web Components). This package contains the `<smartpay-button>` which manages the payment flow, including asset selection, network selection, and QR code display. The QR code is generated locally in the browser; the payment address is never sent to a third-party QR service.

## Installation

```bash
npm install @nexora-smartpay/ui
# or
pnpm add @nexora-smartpay/ui
```

## Usage

### Web Component

You can use the component directly in your HTML or any framework that supports Web Components.

```html
<script type="module">
  import '@nexora-smartpay/ui';
  import { SmartPayClient } from '@nexora-smartpay/core';

  const client = new SmartPayClient({ publicKey: 'pk_...' });
  const button = document.querySelector('smartpay-button');
  button.client = client;
</script>

<smartpay-button 
  process-id="your-process-id" 
  product-title="My Product"
  lang="es"
></smartpay-button>
```

### Attributes and Properties

| Attribute | Property | Type | Description |
|-----------|----------|------|-------------|
| - | `client` | `SmartPayClient` | **Required**. Instance of SmartPayClient. |
| `process-id` | `processId` | `string` | **Required**. The UUID of the payment process. |
| `product-title`| `productTitle`| `string` | Title to display in the payment modal. |
| `lang` | `lang` | `'es' \| 'en'` | Language (default: 'es'). |
| `label` | `label` | `string` | Custom label for the trigger button (default: `'Nexora'`). |
| `barrier-dismissible`| `barrierDismissible`| `boolean` | If true, clicking the backdrop closes the modal. |

The API and realtime hosts are configured on the client, not on the element: pass `apiUrl` / `socketUrl` to `new SmartPayClient({ publicKey, apiUrl, socketUrl })` (types `string`, defaults `https://api.smartpaylatam.com` / `https://ws.smartpaylatam.com`, `https://` only). The framework wrappers (React, Vue, Angular, Svelte, Astro) forward the same `client` object, so this works the same everywhere. See [`@nexora-smartpay/core`](../core#options), including the `LEGACY_APOLO_API_URL` / `LEGACY_APOLO_SOCKET_URL` constants for the Apolo Pay host transition.

### Styling

By default the button and the modal follow Nexora's visual identity: a black button with white text and Nexora's mark, white modal surfaces, black text and grey borders. The font is `'Montserrat', system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif`: Montserrat is used only if your page already loads it (the SDK loads no third-party fonts). Override any of it with the `--payment-button-*` CSS variables on the element, e.g.:

```css
smartpay-button {
  --payment-button-primary: #08090b;      /* button and primary actions */
  --payment-button-on-primary: #ffffff;   /* text on them */
  --payment-button-bg: #ffffff;           /* modal background */
  --payment-button-text: #08090b;
  --payment-button-text-muted: #6b7078;
  --payment-button-border: #d9dde1;
  --payment-button-radius-lg: 10px;       /* button corners */
  --payment-button-font: 'Montserrat', sans-serif;
}
```

### Events

- `success`: Fired when a payment is successfully completed.
- `error`: Fired when an error occurs during the payment flow.

## Migrating from `@apolopay-sdk/ui`

This package was previously published as `@apolopay-sdk/ui`. Replace the dependency with `@nexora-smartpay/ui`. The old names still work but are deprecated:

- `<apolopay-button>` is still registered (as the `ApoloPayButton` subclass of `SmartPayButton`) and logs a one-time deprecation warning. Prefer `<smartpay-button>`.
- `ApoloPayClient` is an alias of `SmartPayClient`.
- The UMD bundle (`dist/nexora-smartpay.umd.js`) exposes `window.NexoraSmartPay` and also `window.ApoloPaySDK` pointing to the same object.
- CSS: the `--payment-button-*` theming variables are unchanged. The internal `--apolo-*` variables are now `--smartpay-*`, but values set through the old `--apolo-*` names are still picked up as a fallback, and so are `--apolopay-display` / `--apolopay-trigger-display` / `--apolopay-trigger-width` (now `--smartpay-display` / `--smartpay-trigger-display` / `--smartpay-trigger-width`).
- Internal elements are now prefixed (`smartpay-payment-modal`, `smartpay-info-modal`, `smartpay-trigger-button`, `smartpay-payment-timer`) to avoid tag collisions on merchant pages.

## License

MIT
