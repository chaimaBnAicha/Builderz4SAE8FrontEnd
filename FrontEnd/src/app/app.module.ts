import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

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
import { PostRequestComponent } from './projects/post-request/post-request.component';
import { GetAllRequestComponent } from './projects/get-all-request/get-all-request.component';
import { UpdateRequestComponent } from './projects/update-request/update-request.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatStepperModule } from '@angular/material/stepper';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
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
    PostRequestComponent,
    GetAllRequestComponent,
    UpdateRequestComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    RouterModule,
    CommonModule,
    AppRoutingModule,
    NavbarModule,
    FooterModule,
    SidebarModule,
    MatStepperModule,
    MatInputModule,
    MatButtonModule,
    MatFormFieldModule,
    MatSelectModule,
  
    ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}