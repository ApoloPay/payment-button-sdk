import { PaymentButton, type ClientResponse } from '@payment-button-sdk/react';

function App() {

  // 3. Usa los props de React (onSuccess)
  const handleSuccess = (response: ClientResponse) => {
    console.log('¡Pago recibido!', response.message);
    alert('¡Gracias por tu compra!');
  };

  return (
    <div>
      <h1>Playground de React 🚀</h1>
      
      {/* 4. Lo usa como un componente nativo de React */}
      <PaymentButton
        publicKey="pk_live_cliente123"
        amount={2500}
        barrierDismissible
        onSuccess={handleSuccess}
        onError={(error) => { console.error(error); }}
      ></PaymentButton>
    </div>
  );
}

export default App;