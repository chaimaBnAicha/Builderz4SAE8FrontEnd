import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { DragDropModule } from '@angular/cdk/drag-drop';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AboutComponent } from './FrontOffice/about/about.component';
import { BlogComponent } from './FrontOffice/blog/blog.component';
import { IndexComponent } from './FrontOffice/index/index.component';
import { ContactComponent } from './FrontOffice/contact/contact.component';
import { PortfolioComponent } from './FrontOffice/portfolio/portfolio.component';
import { ServiceComponent } from './FrontOffice/service/service.component';
import { SingleComponent } from './FrontOffice/single/single.component';
import { TeamComponent } from './FrontOffice/team/team.component';
import { AdminLayoutComponent } from './BackOffice/layouts/admin-layout/admin-layout.component';
import { ReactiveFormsModule } from '@angular/forms'; // ✅ Importer ReactiveFormsModule
import { NavbarModule } from './BackOffice/shared/navbar/navbar.module';
import { FooterModule } from './BackOffice/shared/footer/footer.module';
import { SidebarModule } from './BackOffice/sidebar/sidebar.module';
import { AdminLayoutModule } from './BackOffice/layouts/admin-layout/admin-layout.module';
import { TestComponent } from './BackOffice/test/test.component';
import { TacheComponent } from './tache/tache.component';
import { PostTacheComponent } from './tache/post-tache/post-tache.component';
import { DeleteTacheComponent } from './tache/delete-tache/delete-tache.component';
import { UpdateTacheComponent } from './tache/update-tache/update-tache.component';
import { GetAllTacheComponent } from './tache/get-all-tache/get-all-tache.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { KanbanComponent } from './tache/kanban/kanban.component';
import { DatePipe } from '@angular/common';


@NgModule({
  declarations: [
    AppComponent,
    AboutComponent,
    BlogComponent,
    IndexComponent,
    ContactComponent,
    PortfolioComponent,
    ServiceComponent,
    SingleComponent,
    TeamComponent,
    AdminLayoutComponent,
    TestComponent,
    TacheComponent,
    PostTacheComponent,
    DeleteTacheComponent,
    UpdateTacheComponent,
    GetAllTacheComponent,
    KanbanComponent,
    
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    RouterModule,
    CommonModule,
    AppRoutingModule,
    NavbarModule,
    FooterModule,
    SidebarModule,
    ReactiveFormsModule ,
    HttpClientModule,
    DragDropModule,
    BrowserAnimationsModule,
    DragDropModule ,

  ],
  providers: [DatePipe],  // Add this

  bootstrap: [AppComponent]
})
export class AppModule {}