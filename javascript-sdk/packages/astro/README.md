# @apolopay-sdk/astro

Astro integration for the Apolo Pay SDK. Provides a component to integrate the Apolo Pay payment button into Astro projects.

## Installation

```bash
npm install @apolopay-sdk/astro
# or
pnpm add @apolopay-sdk/astro
```

## Usage

```astro
---
import { ApoloPayButton, ApoloPayClient } from '@apolopay-sdk/astro';

// 1. Initialize the client
const client = new ApoloPayClient({
  publicKey: 'pk_test_...',
});

const processId = 'your-process-id';
---

<html>
  <body>
    <h1>My Astro Store</h1>

    <!-- 2. Use the component -->
    <ApoloPayButton
      client={client}
      processId={processId}
      productTitle="Order #ASTRO-1"
      lang="es"
      client:load
    />
  </body>
</html>
```

## Props

- `client`: (ApoloPayClient) **Required**.
- `processId`: (string) **Required**.
- `productTitle`: (string)
- `lang`: ('es' | 'en')
- `label`: (string)
- `barrierDismissible`: (boolean)

## License

MIT
