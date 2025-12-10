import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PaymentButtonModule } from '@payment-button-sdk/angular';
import { type PaymentResponse, type PaymentError } from '@payment-button-sdk/core';

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

  // 3. (Opcional) Añade los manejadores de eventos
  onSuccess(response: PaymentResponse) {
    console.log('¡Pago exitoso (Angular)!', response);
    alert('Pago OK: ' + response.transactionId);
  }

  onError(error: PaymentError) {
    console.error('Error en pago (Angular):', error);
    alert('Error: ' + error.message);
  }
}