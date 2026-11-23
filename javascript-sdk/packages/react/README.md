# @nexora-smartpay/react

React wrapper for the Nexora SmartPay SDK. Provides a convenient component to integrate the Nexora SmartPay payment button into React applications.

## Installation

```bash
npm install @nexora-smartpay/react
# or
pnpm add @nexora-smartpay/react
```

## Usage

```tsx
import { SmartPayButton, SmartPayClient, type ClientResponse, type ClientError } from '@nexora-smartpay/react';

// 1. Initialize the client
const client = new SmartPayClient({
  publicKey: 'pk_test_...',
});

function App() {
  const handleSuccess = (response: ClientResponse) => {
    console.log('Payment successful!', response);
  };

  const handleError = (error: ClientError) => {
    console.error('Payment error:', error);
  };

  return (
    <div className="App">
      <h1>My Store</h1>
      
      {/* 2. Use the component */}
      <SmartPayButton
        client={client}
        processId="your-process-id"
        productTitle="Order #12345"
        lang="es"
        onSuccess={handleSuccess}
        onError={handleError}
        barrierDismissible={true}
      />
    </div>
  );
}
```

## Props

The `SmartPayButton` component accepts the following props:

- `client`: (SmartPayClient) **Required**. Instance of SmartPayClient.
- `processId`: (string) **Required**. The UUID of the payment process.
- `productTitle`: (string) Title to display in the modal.
- `lang`: ('es' | 'en') Language.
- `label`: (string) Custom label for the button.
- `barrierDismissible`: (boolean) If true, clicking backdrop closes modal.
- `onSuccess`: (function) Callback when payment completes.
- `onError`: (function) Callback when an error occurs.

## Migrating from `@apolopay-sdk/react`

This package was previously published as `@apolopay-sdk/react`. Replace the dependency with `@nexora-smartpay/react`. `ApoloPayButton` and `ApoloPayClient` are still exported as deprecated aliases of `SmartPayButton` / `SmartPayClient`, so existing code keeps working after changing the import path.

## License

MIT
