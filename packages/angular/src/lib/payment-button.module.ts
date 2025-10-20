import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PaymentButtonComponent } from './payment-button.component';
// No importamos el servicio aquí porque es 'providedIn: root'

@NgModule({
  declarations: [],
  imports: [
    CommonModule, // Necesario para ngIf
    PaymentButtonComponent
  ],
  exports: [
    PaymentButtonComponent // Exporta el componente para que otros módulos lo usen
  ]
})
export class PaymentButtonModule { }