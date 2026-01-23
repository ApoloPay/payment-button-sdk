import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApoloPayButtonComponent } from './apolopay-button.component';
import '@apolopay-sdk/ui';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    ApoloPayButtonComponent
  ],
  exports: [
    ApoloPayButtonComponent
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ]
})
export class ApoloPayButtonModule { }