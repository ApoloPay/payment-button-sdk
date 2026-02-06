# @apolopay-sdk/angular

Angular wrapper for the Apolo Pay SDK. Provides a component to integrate the Apolo Pay payment button into Angular applications.

## Installation

```bash
npm install @apolopay-sdk/angular
# or
pnpm add @apolopay-sdk/angular
```

## Usage

### 1. Add the component to your Module or Component

```typescript
import { CUSTOM_ELEMENTS_SCHEMA, Component } from '@angular/core';
import { ApoloPayButtonComponent, ApoloPayClient, type ClientResponse, type ClientError } from '@apolopay-sdk/angular';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ApoloPayButtonComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA], // Required for Web Components
  template: `
    <apolopay-button
      [client]="client"
      [processId]="processId"
      productTitle="Order #ANG-1"
      (success)="handleSuccess($event)"
      (error)="handleError($event)"
    ></apolopay-button>
  `
})
export class AppComponent {
  client = new ApoloPayClient({ publicKey: 'pk_test_...' });
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

- `[client]`: (ApoloPayClient) **Required**.
- `[processId]`: (string) **Required**.
- `[productTitle]`: (string)
- `[lang]`: ('es' | 'en')
- `[label]`: (string)
- `[barrierDismissible]`: (boolean)
- `(success)`: Event fired on success.
- `(error)`: Event fired on error.

## License

MIT
