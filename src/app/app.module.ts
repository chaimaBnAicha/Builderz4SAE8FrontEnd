import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AdminLayoutModule } from './BackOffice/layouts/admin-layout/admin-layout.module';
import { SharedModule } from './shared/shared.module';

// FrontOffice Components
import { AboutComponent } from './FrontOffice/about/about.component';
import { IndexComponent } from './FrontOffice/index/index.component';
import { ContactComponent } from './FrontOffice/contact/contact.component';
import { PortfolioComponent } from './FrontOffice/portfolio/portfolio.component';
import { ServiceComponent } from './FrontOffice/service/service.component';
import { TeamComponent } from './FrontOffice/team/team.component';
import { TestComponent } from './BackOffice/test/test.component';
import { NgChartsModule } from 'ng2-charts';

@NgModule({
  declarations: [
    AppComponent,
    AboutComponent,
    IndexComponent,
    ContactComponent,
    PortfolioComponent,
    ServiceComponent,
    TeamComponent,
    TestComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    RouterModule,
    CommonModule,
    FormsModule,
    AppRoutingModule,
    AdminLayoutModule,
    SharedModule,
    NgbModule,
    NgChartsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }