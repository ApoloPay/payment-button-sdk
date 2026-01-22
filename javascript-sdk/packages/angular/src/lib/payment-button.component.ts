import { Component, Input, Output, EventEmitter, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import type { ClientResponse, ClientError, Locale, ApoloPayClient } from '@payment-button-sdk/ui';

@Component({
  selector: 'apolo-payment-button',
  standalone: true,
  template: `
    <payment-button
      [client]="client"
      [attr.process-id]="processId"
      [label]="label"
      [metadata]="metadata"
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
  @Input() client?: ApoloPayClient;
  @Input() processId?: string;
  @Input() metadata?: Record<string, any>;
  @Input() productTitle?: string;
  @Input() lang?: Locale;
  @Input() label?: string;
  @Input() loading?: boolean;
  @Input() disabled?: boolean;
  @Input() barrierDismissible?: boolean;

  // 6. Define los Outputs (eventos)
  @Output() success = new EventEmitter<ClientResponse>();
  @Output() error = new EventEmitter<ClientError>();

  // 7. Traduce el CustomEvent ($event) a un EventEmitter de Angular
  onSuccess(event: Event) {
    // $event.detail contiene los datos del evento del Web Component
    this.success.emit((event as CustomEvent<ClientResponse>).detail);
  }

  onError(event: Event) {
    this.error.emit((event as CustomEvent<ClientError>).detail);
  }
}