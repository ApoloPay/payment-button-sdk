import { Component, Input, Output, EventEmitter, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import type { ClientResponse, ClientError, Locale, ApoloPayClient, PaymentResponseData, PartialPaymentResponseData } from '@apolopay-sdk/ui';

@Component({
  selector: 'apolopay-button-component',
  standalone: true,
  template: `
    <apolopay-button
      [client]="client"
      [attr.process-id]="processId"
      [label]="label"
      [lang]="lang"
      [attr.product-title]="productTitle"
      [loading]="loading"
      [disabled]="disabled"
      [attr.barrier-dismissible]="barrierDismissible ? '' : null"
      (success)="onSuccess($event)"
      (partialPayment)="onPartialPayment($event)"
      (error)="onError($event)"
      (expired)="onExpired($event)"
    >
      <ng-content></ng-content>
    </apolopay-button>
  `,
  // 4. Asegura que el wrapper se comporte como un bloque
  styles: [`
    :host { display: inline-block; }

    apolopay-button { display: block; }
  `],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ]
})
export class ApoloPayButtonComponent {
  // 5. Define los Inputs (props)
  @Input() client?: ApoloPayClient;
  @Input() processId?: string;
  @Input() productTitle?: string;
  @Input() lang?: Locale;
  @Input() label?: string;
  @Input() loading?: boolean;
  @Input() disabled?: boolean;
  @Input() barrierDismissible?: boolean;

  // 6. Define los Outputs (eventos)
  @Output() success = new EventEmitter<ClientResponse<PaymentResponseData>>();
  @Output() partialPayment = new EventEmitter<ClientResponse<PartialPaymentResponseData>>();
  @Output() error = new EventEmitter<ClientError>();
  @Output() expired = new EventEmitter<ClientError>();

  // 7. Traduce el CustomEvent ($event) a un EventEmitter de Angular
  onSuccess(event: Event) {
    // $event.detail contiene los datos del evento del Web Component
    this.success.emit((event as CustomEvent<ClientResponse<PaymentResponseData>>).detail);
  }

  onPartialPayment(event: Event) {
    // $event.detail contiene los datos del evento del Web Component
    this.partialPayment.emit((event as CustomEvent<ClientResponse<PartialPaymentResponseData>>).detail);
  }

  onError(event: Event) {
    this.error.emit((event as CustomEvent<ClientError>).detail);
  }

  onExpired(event: Event) {
    this.expired.emit((event as CustomEvent<ClientError>).detail);
  }
}