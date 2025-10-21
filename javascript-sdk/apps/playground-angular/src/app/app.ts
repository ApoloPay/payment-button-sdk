import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { PaymentButtonModule, type PaymentResponse, type PaymentError } from '@payment-button-sdk/angular';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule, 
    RouterOutlet, 
    PaymentButtonModule
  ],
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