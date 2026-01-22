import { ApoloPayClient, PaymentButton, type ClientResponse } from '@payment-button-sdk/react';
import { useEffect, useState } from 'react';

function App() {
  const [client, setClient] = useState<ApoloPayClient | undefined>(undefined);

  // 3. Usa los props de React (onSuccess)
  const handleSuccess = (response: ClientResponse) => {
    console.log('¡Pago recibido!', response.message);
    alert('¡Gracias por tu compra!');
  };

  useEffect(() => {
    const client = new ApoloPayClient({
      publicKey: 'pk_test_123',
    });
    setClient(client);
  }, [])

  return (
    <div>
      <h1>Playground de React 🚀</h1>
      
      {/* 4. Lo usa como un componente nativo de React */}
      <PaymentButton
        client={client}
        processId="processId"
        barrierDismissible
        onSuccess={handleSuccess}
        onError={(error) => { console.error(error); }}
      ></PaymentButton>
    </div>
  );
}

export default App;