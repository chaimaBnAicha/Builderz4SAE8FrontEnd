import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NgxPaginationModule } from 'ngx-pagination';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AboutComponent } from './FrontOffice/about/about.component';

import { IndexComponent } from './FrontOffice/index/index.component';
import { ContactComponent } from './FrontOffice/contact/contact.component';
import { PortfolioComponent } from './FrontOffice/portfolio/portfolio.component';
import { ServiceComponent } from './FrontOffice/service/service.component';

import { TeamComponent } from './FrontOffice/team/team.component';
import { AdminLayoutComponent } from './BackOffice/layouts/admin-layout/admin-layout.component';

import { NavbarModule } from './BackOffice/shared/navbar/navbar.module';
import { FooterModule } from './BackOffice/shared/footer/footer.module';
import { SidebarModule } from './BackOffice/sidebar/sidebar.module';
import { AdminLayoutModule } from './BackOffice/layouts/admin-layout/admin-layout.module';
import { TestComponent } from './BackOffice/test/test.component';
import { AdvanceComponent } from './FrontOffice/advance/advance/advance.component';
import { AddAdvanceComponent } from './FrontOffice/advance/add-advance/add-advance.component';
import { UpdateAdvanceComponent } from './FrontOffice/advance/update-advance/update-advance.component';
import { AdvanceBackComponent } from './BackOffice/Advance/advance-back/advance-back.component';
import { SafeHtmlPipe } from './pipes/safe-html.pipe';
import { EditorModule, TINYMCE_SCRIPT_SRC } from '@tinymce/tinymce-angular';
import { NgChartsModule } from 'ng2-charts';
import { PieChartComponent } from './BackOffice/AdvanceCharts/pie-chart/pie-chart.component';
import { DashboardComponent } from './BackOffice/dashboard/dashboard.component';
import { BarChartComponent } from './BackOffice/AdvanceCharts/bar-chart/bar-chart.component';

@NgModule({
  declarations: [
    AppComponent,
    AboutComponent,
   
    IndexComponent,
    ContactComponent,
    PortfolioComponent,
    ServiceComponent,
    
    TeamComponent,
    AdminLayoutComponent,
    TestComponent,
    AdvanceComponent,
    AddAdvanceComponent,
    UpdateAdvanceComponent,
    AdvanceBackComponent,
    SafeHtmlPipe,
    DashboardComponent,
    PieChartComponent,
    BarChartComponent

  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    CommonModule,
    AppRoutingModule,
    NavbarModule,
    FooterModule,
    SidebarModule,
    EditorModule,
    NgxPaginationModule,
    NgChartsModule
  ],
  providers: [
    {provide: TINYMCE_SCRIPT_SRC, useValue: 'tinymce/tinymce.min.js'}
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}