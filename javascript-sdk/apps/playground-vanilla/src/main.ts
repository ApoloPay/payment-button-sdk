// 1. ¡IMPORTANTE! Importa el paquete de UI.
// Esto ejecuta el código que registra la etiqueta <payment-button>
// en el navegador.
import '@payment-button-sdk/ui';

// 2. Importa los tipos (opcional, pero buena práctica)
import type { PaymentResponse, PaymentError } from '@payment-button-sdk/ui';

// 3. Usa APIs nativas del DOM
const miBoton = document.getElementById('btn-pago');

if (miBoton) {
  console.log('Botón de pago encontrado, añadiendo listeners...');

  // 4. Escucha el evento 'success' nativo
  miBoton.addEventListener('success', (event: Event) => {
    // Hacemos un cast a CustomEvent para obtener los datos
    const response = (event as CustomEvent<PaymentResponse>).detail;

    console.log('¡Éxito (Vanilla JS)!', response.transactionId);
    alert('Pago OK: ' + response.transactionId);
  });

  // 5. Escucha el evento 'error' nativo
  miBoton.addEventListener('error', (event: Event) => {
    const error = (event as CustomEvent<PaymentError>).detail;

    console.error('Error (Vanilla JS):', error.message);
    alert('Error: ' + error.message);
  });

} else {
  console.error('No se pudo encontrar el #btn-pago');
}