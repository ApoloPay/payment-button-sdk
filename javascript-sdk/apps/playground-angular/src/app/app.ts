import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PaymentButtonModule, ApoloPayClient } from '@payment-button-sdk/angular';
import type { ClientResponse, ClientError } from '@payment-button-sdk/core';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    PaymentButtonModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  title = 'playground-angular';

  // 1. Instancia el cliente de Apolo Pay
  client = new ApoloPayClient({
    publicKey: 'pk_test_ANGULAR_123',
  });

  // 2. Define el proceso de pago
  processId = 'process_id_demo';

  // 3. (Opcional) Añade los manejadores de eventos
  onSuccess(response: ClientResponse) {
    console.log('¡Pago exitoso (Angular)!', response);
    alert('Pago OK: ' + response.message);
  }

  onError(error: ClientError) {
    console.error('Error en pago (Angular):', error);
    alert('Error: ' + error.message);
  }
}