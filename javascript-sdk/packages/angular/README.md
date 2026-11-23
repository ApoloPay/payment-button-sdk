# @nexora-smartpay/angular

Angular wrapper for the Nexora SmartPay SDK. Provides a component to integrate the Nexora SmartPay payment button into Angular applications.

## Installation

```bash
npm install @nexora-smartpay/angular
# or
pnpm add @nexora-smartpay/angular
```

## Usage

### 1. Add the component to your Module or Component

```typescript
import { CUSTOM_ELEMENTS_SCHEMA, Component } from '@angular/core';
import { SmartPayButtonComponent, SmartPayClient, type ClientResponse, type ClientError } from '@nexora-smartpay/angular';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [SmartPayButtonComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA], // Required for Web Components
  template: `
    <smartpay-button-component
      [client]="client"
      [processId]="processId"
      productTitle="Order #ANG-1"
      (success)="handleSuccess($event)"
      (error)="handleError($event)"
    ></smartpay-button-component>
  `
})
export class AppComponent {
  client = new SmartPayClient({ publicKey: 'pk_test_...' });
  processId = 'your-process-id';

  handleSuccess(response: ClientResponse) {
    console.log('Payment successful!', response);
  }

  handleError(error: ClientError) {
    console.error('Payment error:', error);
  }
}
```

## Props and Events

- `[client]`: (SmartPayClient) **Required**.
- `[processId]`: (string) **Required**.
- `[productTitle]`: (string)
- `[lang]`: ('es' | 'en')
- `[label]`: (string)
- `[barrierDismissible]`: (boolean)
- `(success)`: Event fired on success.
- `(error)`: Event fired on error.

## Migrating from `@apolopay-sdk/angular`

This package was previously published as `@apolopay-sdk/angular`. Replace the dependency with `@nexora-smartpay/angular`. `ApoloPayButtonComponent`, `ApoloPayButtonModule` and `ApoloPayClient` are still exported as deprecated aliases of `SmartPayButtonComponent`, `SmartPayButtonModule` and `SmartPayClient`, and the component still matches the old `<apolopay-button-component>` selector as well as the new `<smartpay-button-component>`.

## License

MIT
