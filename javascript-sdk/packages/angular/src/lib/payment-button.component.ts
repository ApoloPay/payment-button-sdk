import { Component, Input, Output, EventEmitter, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import type { PaymentResponse, PaymentError } from '@payment-button-sdk/ui';

@Component({
  selector: 'apolo-payment-button',
  standalone: true,
  // 2. El template ahora solo renderiza el Web Component
  //    y traduce los eventos.
  template: `
    <payment-button
      [attr.api-key]="apiKey"
      [attr.amount]="amount"
      (success)="onSuccess($event)"
      (error)="onError($event)"
    >
      <ng-content></ng-content>
    </payment-button>
  `,
  // 4. Asegura que el wrapper se comporte como un bloque
  styles: [':host { display: inline-block; }'],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ]
})
export class PaymentButtonComponent {
  // 5. Define los Inputs (props)
  @Input() apiKey!: string;
  @Input() amount!: number;

  // 6. Define los Outputs (eventos)
  @Output() success = new EventEmitter<PaymentResponse>();
  @Output() error = new EventEmitter<PaymentError>();

  // 7. Traduce el CustomEvent ($event) a un EventEmitter de Angular
  onSuccess(event: Event) {
    // $event.detail contiene los datos del evento del Web Component
    this.success.emit((event as CustomEvent<PaymentResponse>).detail);
  }

  onError(event: Event) {
    this.error.emit((event as CustomEvent<PaymentError>).detail);
  }
}