import { Component, Input, Output, EventEmitter, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import type { ClientResponse, ClientError, Locale, SmartPayClient, PaymentResponseData, PartialPaymentResponseData } from '@nexora-smartpay/ui';

@Component({
  selector: 'smartpay-button-component, apolopay-button-component',
  standalone: true,
  template: `
    <smartpay-button
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
      (dismissed)="onDismissed($event)"
    >
      <ng-content></ng-content>
    </smartpay-button>
  `,
  // 4. Asegura que el wrapper se comporte como un bloque
  styles: [`
    :host { display: inline-block; }

    smartpay-button { display: block; }
  `],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ]
})
export class SmartPayButtonComponent {
  // 5. Define los Inputs (props)
  @Input() client?: SmartPayClient;
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
  @Output() dismissed = new EventEmitter<void>();

  // 7. Traduce el CustomEvent ($event) a un EventEmitter de Angular
  onSuccess(event: Event) {
    event.stopPropagation();
    this.success.emit((event as CustomEvent<ClientResponse<PaymentResponseData>>).detail);
  }

  onPartialPayment(event: Event) {
    event.stopPropagation();
    this.partialPayment.emit((event as CustomEvent<ClientResponse<PartialPaymentResponseData>>).detail);
  }

  onError(event: Event) {
    event.stopPropagation();
    this.error.emit((event as CustomEvent<ClientError>).detail);
  }

  onExpired(event: Event) {
    event.stopPropagation();
    this.expired.emit((event as CustomEvent<ClientError>).detail);
  }

  onDismissed(event: Event) {
    event.stopPropagation();
    this.dismissed.emit();
  }
}

/**
 * @deprecated Use `SmartPayButtonComponent` (selector `smartpay-button-component`) instead.
 * Pre-2.0 name, kept for backwards compatibility; the legacy `apolopay-button-component`
 * selector is still matched by `SmartPayButtonComponent`.
 */
export { SmartPayButtonComponent as ApoloPayButtonComponent };
