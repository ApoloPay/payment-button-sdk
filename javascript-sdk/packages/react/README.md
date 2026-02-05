# @apolopay-sdk/react

React wrapper for the Apolo Pay SDK. Provides a convenient component to integrate the Apolo Pay payment button into React applications.

## Installation

```bash
npm install @apolopay-sdk/react
# or
pnpm add @apolopay-sdk/react
```

## Usage

```tsx
import { ApoloPayButton, ApoloPayClient, type ClientResponse, type ClientError } from '@apolopay-sdk/react';

// 1. Initialize the client
const client = new ApoloPayClient({
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
      <ApoloPayButton
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

The `ApoloPayButton` component accepts the following props:

- `client`: (ApoloPayClient) **Required**. Instance of ApoloPayClient.
- `processId`: (string) **Required**. The UUID of the payment process.
- `productTitle`: (string) Title to display in the modal.
- `lang`: ('es' | 'en') Language.
- `label`: (string) Custom label for the button.
- `barrierDismissible`: (boolean) If true, clicking backdrop closes modal.
- `onSuccess`: (function) Callback when payment completes.
- `onError`: (function) Callback when an error occurs.

## License

MIT
