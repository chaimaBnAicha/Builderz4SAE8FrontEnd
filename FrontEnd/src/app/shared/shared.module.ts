import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InsuranceChartsComponent } from '../BackOffice/insurance/insurance-charts/insurance-charts.component';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [
    InsuranceChartsComponent
  ],
  imports: [
    CommonModule,
    HttpClientModule
  ],
  exports: [
    InsuranceChartsComponent
  ]
})
export class SharedModule { }
