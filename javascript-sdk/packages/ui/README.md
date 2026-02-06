# @apolopay-sdk/ui

The UI components for Apolo Pay, built with Lit (Web Components). This package contains the `<apolopay-button>` which manages the payment flow, including asset selection, network selection, and QR code display.

## Installation

```bash
npm install @apolopay-sdk/ui
# or
pnpm add @apolopay-sdk/ui
```

## Usage

### Web Component

You can use the component directly in your HTML or any framework that supports Web Components.

```html
<script type="module">
  import '@apolopay-sdk/ui';
  import { ApoloPayClient } from '@apolopay-sdk/core';

  const client = new ApoloPayClient({ publicKey: 'pk_...' });
  const button = document.querySelector('apolopay-button');
  button.client = client;
</script>

<apolopay-button 
  process-id="your-process-id" 
  product-title="My Product"
  lang="es"
></apolopay-button>
```

### Attributes and Properties

| Attribute | Property | Type | Description |
|-----------|----------|------|-------------|
| - | `client` | `ApoloPayClient` | **Required**. Instance of ApoloPayClient. |
| `process-id` | `processId` | `string` | **Required**. The UUID of the payment process. |
| `product-title`| `productTitle`| `string` | Title to display in the payment modal. |
| `lang` | `lang` | `'es' \| 'en'` | Language (default: 'es'). |
| `label` | `label` | `string` | Custom label for the trigger button. |
| `barrier-dismissible`| `barrierDismissible`| `boolean` | If true, clicking the backdrop closes the modal. |

### Events

- `success`: Fired when a payment is successfully completed.
- `error`: Fired when an error occurs during the payment flow.

## License

MIT
