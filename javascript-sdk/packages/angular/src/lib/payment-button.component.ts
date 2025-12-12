import { Component, Input, Output, EventEmitter, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import type { PaymentResponse, PaymentError, Locale } from '@payment-button-sdk/ui';

@Component({
  selector: 'apolo-payment-button',
  standalone: true,
  template: `
    <payment-button
      [attr.public-key]="publicKey"
      [amount]="amount"
      [label]="label"
      [email]="email"
      [lang]="lang"
      [attr.product-title]="productTitle"
      [loading]="loading"
      [disabled]="disabled"
      [attr.barrier-dismissible]="barrierDismissible ? '' : null"
      (success)="onSuccess($event)"
      (error)="onError($event)"
    >
      <ng-content></ng-content>
    </payment-button>
  `,
  // 4. Asegura que el wrapper se comporte como un bloque
  styles: [`
    :host { display: inline-block; }

    payment-button { display: block; }
  `],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ]
})
export class PaymentButtonComponent {
  // 5. Define los Inputs (props)
  @Input() publicKey!: string;
  @Input() amount!: number;
  @Input() email!: string;
  @Input() productTitle?: string;
  @Input() lang?: Locale;
  @Input() label?: string;
  @Input() loading?: boolean;
  @Input() disabled?: boolean;
  @Input() barrierDismissible?: boolean;

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