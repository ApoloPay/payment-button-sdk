import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PaymentButtonComponent } from './payment-button.component';
import '@payment-button-sdk/ui';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    PaymentButtonComponent
  ],
  exports: [
    PaymentButtonComponent
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ]
})
export class PaymentButtonModule { }