import { PaymentButton, type PaymentResponse } from '@payment-button-sdk/react';

function App() {

  // 3. Usa los props de React (onSuccess)
  const handleSuccess = (response: PaymentResponse) => {
    console.log('¡Pago recibido!', response.transactionId);
    alert('¡Gracias por tu compra!');
  };

  return (
    <div>
      <h1>Bienvenido a mi Tienda</h1>
      
      {/* 4. Lo usa como un componente nativo de React */}
      <PaymentButton
        apiKey="pk_live_cliente123"
        amount={2500}
        onSuccess={handleSuccess}
        onError={(error) => { console.error(error); }}
      >
        Pagar $25.00 USD
      </PaymentButton>
    </div>
  );
}

export default App;