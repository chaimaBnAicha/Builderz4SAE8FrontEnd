import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router';

import { AdminLayoutComponent } from './BackOffice/layouts/admin-layout/admin-layout.component';
import { IndexComponent } from './FrontOffice/index/index.component';
import { BlogComponent } from './FrontOffice/blog/blog.component';
import { ContactComponent } from './FrontOffice/contact/contact.component';
import { PortfolioComponent } from './FrontOffice/portfolio/portfolio.component';
import { ServiceComponent } from './FrontOffice/service/service.component';
import { SingleComponent } from './FrontOffice/single/single.component';
import { TeamComponent } from './FrontOffice/team/team.component';
import { AboutComponent } from './FrontOffice/about/about.component';
import { HomeComponent } from './BackOffice/home/home.component';
import { UserComponent } from './BackOffice/user/user.component';
import { TestComponent } from './BackOffice/test/test.component';
import { MapsComponent } from './BackOffice/maps/maps.component';
import { TablesComponent } from './BackOffice/tables/tables.component';
import { TypographyComponent } from './BackOffice/typography/typography.component';
import { IconsComponent } from './BackOffice/icons/icons.component';
import { NotificationsComponent } from './BackOffice/notifications/notifications.component';
import { UpgradeComponent } from './BackOffice/upgrade/upgrade.component';
import { PostTacheComponent } from './tache/post-tache/post-tache.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientJsonpModule, HttpClientModule } from '@angular/common/http';
import { GetAllTacheComponent } from './tache/get-all-tache/get-all-tache.component';
import { UpdateTacheComponent } from './tache/update-tache/update-tache.component';
import { KanbanComponent } from './tache/kanban/kanban.component';
import { TacheResponseComponent } from './tache/tache-response/tache-response.component';

// Define your routes
const routes: Routes = [
  // FrontOffice routes
  { path: '', component: IndexComponent },
  { path: 'blog', component: BlogComponent },
  { path: 'about', component: AboutComponent },
  { path: 'contact', component: ContactComponent },
  { path: 'portfolio', component: PortfolioComponent },
  { path: 'service', component: ServiceComponent },
  { path: 'single', component: SingleComponent },
  { path: 'team', component: TeamComponent },
  { path: 'test', component: TestComponent },
  {path:'tache',component:PostTacheComponent},
  {path:'get-all-tache',component:GetAllTacheComponent},
  {path:'tache/:id',component:UpdateTacheComponent},
{path:'kanban',component:KanbanComponent},
  // BackOffice routes
  {
    path: 'admin',
    component: AdminLayoutComponent,
    children: [
          { path: 'dashboard',      component: HomeComponent },
         {path: 'admin2',          component: AdminLayoutComponent },
         { path: 'user',           component: UserComponent },
         { path: 'table',          component: TablesComponent },
         { path: 'typography',     component: TypographyComponent },
         { path: 'icons',          component: IconsComponent },
         { path: 'maps',           component: MapsComponent },
         { path: 'notifications',  component: NotificationsComponent },
         { path: 'upgrade',        component: UpgradeComponent },
      // Add other backoffice child routes here
      { path: '', redirectTo: 'home', pathMatch: 'full' }, // Default route under admin layout
    ],
  },
  { path: 'reponse/:taskId/:response', component: TacheResponseComponent },
  // Default route for unknown paths
  { path: '**', redirectTo: '' },
];

@NgModule({
  imports: [
    CommonModule,
    BrowserModule,
    RouterModule.forRoot(routes, {
      useHash: true, // Use hash-based routing (optional)
    }),
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
