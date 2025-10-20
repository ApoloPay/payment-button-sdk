import { PaymentButton } from '@payment-button-sdk/react'
import '@payment-button-sdk/react/style.css';

function App() {
  return (
    <div>
      <h1>Mi Playground de Pagos</h1>
      <PaymentButton
        apiKey="pk_test_123"
        amount={1000}
        currency="USD"
        // ...etc
      >
        Pagar ahora
      </PaymentButton>
    </div>
  )
}
export default App