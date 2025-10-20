import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { PaymentService } from './payment.service';
import type { PaymentResponse, PaymentError } from '@payment-button-sdk/core';
import { Subscription } from 'rxjs';

@Component({
  selector: 'payment-button',
  standalone: true,
  imports: [CommonModule],
  template: `
    <button (click)="onClick()" [disabled]="status === 'loading'" class="payment-button-angular">
      <ng-container *ngIf="status === 'loading'; else content">
        Procesando...
      </ng-container>
      <ng-template #content>
        <ng-content></ng-content> </ng-template>
    </button>
  `,
  styles: [`
    .payment-button-angular {
      background-color: #DD0031; /* Angular Red */
      color: white;
      padding: 10px 15px;
      border: none;
      border-radius: 5px;
      cursor: pointer;
      font-weight: bold;
    }
    .payment-button-angular:disabled {
      background-color: #a1a1a1;
      cursor: not-allowed;
    }
  `]
})
export class PaymentButtonComponent implements OnInit {
  @Input() apiKey!: string;
  @Input() amount!: number;
  @Input() currency!: string;

  @Output() paymentSuccess = new EventEmitter<PaymentResponse>();
  @Output() paymentError = new EventEmitter<PaymentError>();

  public status: 'idle' | 'loading' | 'success' | 'error' = 'idle';
  private subs = new Subscription();

  constructor(private paymentService: PaymentService) {}

  ngOnInit() {
    this.paymentService.init({
      apiKey: this.apiKey,
      amount: this.amount,
      currency: this.currency,
    });

    this.subs.add(this.paymentService.status$.subscribe(status => this.status = status));
    this.subs.add(this.paymentService.success$.subscribe(res => this.paymentSuccess.emit(res)));
    this.subs.add(this.paymentService.error$.subscribe(err => this.paymentError.emit(err)));
  }

  onClick() {
    this.paymentService.pay();
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }
}