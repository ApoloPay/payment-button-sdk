import { Injectable } from '@angular/core';
import { PaymentClient, type PaymentOptions, type PaymentResponse, type PaymentError } from '@payment-button-sdk/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  public status$ = new Subject<'idle' | 'loading' | 'success' | 'error'>();
  public success$ = new Subject<PaymentResponse>();
  public error$ = new Subject<PaymentError>();

  private client: PaymentClient | null = null;

  init(options: Omit<PaymentOptions, 'onSuccess' | 'onError'>) {
    this.client = new PaymentClient({
      ...options,
      onSuccess: (response) => {
        this.status$.next('success');
        this.success$.next(response);
      },
      onError: (error) => {
        this.status$.next('error');
        this.error$.next(error);
      }
    });
  }

  pay() {
    if (!this.client) {
      console.error('PaymentService no inicializado. Llama a init() primero.');
      return;
    }
    this.status$.next('loading');
    this.client.initiatePayment();
  }
}