import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgxPayPalModule } from 'ngx-paypal';

import { ViewInsuranceComponent } from './view-insurance/view-insurance.component';
// Import other components as needed

@NgModule({
  declarations: [
    ViewInsuranceComponent
    // Add other components as needed
  ],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    NgxPayPalModule
  ],
  exports: [
    ViewInsuranceComponent
  ]
})
export class InsuranceModule { }
