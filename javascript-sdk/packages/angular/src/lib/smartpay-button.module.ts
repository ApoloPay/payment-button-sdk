import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SmartPayButtonComponent } from './smartpay-button.component';
import '@nexora-smartpay/ui';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    SmartPayButtonComponent
  ],
  exports: [
    SmartPayButtonComponent
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ]
})
export class SmartPayButtonModule { }

/** @deprecated Use `SmartPayButtonModule` instead. Pre-2.0 name, kept for backwards compatibility. */
export { SmartPayButtonModule as ApoloPayButtonModule };
