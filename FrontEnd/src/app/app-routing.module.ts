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
import { GetAllTacheComponent } from './tache/get-all-tache/get-all-tache.component';
import { UpdateTacheComponent } from './tache/update-tache/update-tache.component';
import { KanbanComponent } from './tache/kanban/kanban.component';
import { TacheResponseComponent } from './tache/tache-response/tache-response.component';
import { AddEtapeComponent } from './etape/add-etape/add-etape.component';
import { ListEtapeComponent } from './etape/list-etape/list-etape.component';
import { CreateMeetingComponent } from './meeting/create-meeting/create-meeting.component';
import { EditEtapeComponent } from './etape/edit-etape/edit-etape.component';
import { EtapeFilterComponent } from './etape/etape-filter/etape-filter.component';
import { MeetingCalendarComponent } from './meeting/meeting-calendar/meeting-calendar.component';
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
  { path: 'tache', component: PostTacheComponent },
  { path: 'get-all-tache', component: GetAllTacheComponent },
  { path: 'tache/:id', component: UpdateTacheComponent },
  { path: 'kanban', component: KanbanComponent },
  { path: 'tasks', component: GetAllTacheComponent },
  { path: 'task/create', component: PostTacheComponent },
  { path: 'task/edit/:id', component: UpdateTacheComponent },
  { path: 'task/kanban', component: KanbanComponent },
  { path: 'etapes', component: AddEtapeComponent },
  {path:'allmeeting',component:MeetingCalendarComponent},

  // Step-related routes
  { path: 'steps', component: ListEtapeComponent },
  { path: 'step/create', component: AddEtapeComponent },
  { path: 'task/:id/steps', component: ListEtapeComponent },
  { path: 'create-meeting', component: CreateMeetingComponent },
 {path: 'etape/tache/:id',component: ListEtapeComponent },
 { path: 'etapes', component: AddEtapeComponent },
{path:'list-etape',component:ListEtapeComponent},
{ path: 'etape/edit/:id', component: EditEtapeComponent },
{ path: 'steps', component: ListEtapeComponent },
{ path: 'step/create', component: AddEtapeComponent },
{ path: 'step/edit/:id', component: EditEtapeComponent },
{ path: 'step/filter', component: EtapeFilterComponent },
{ path: 'task/:id/steps', component: ListEtapeComponent },
  // BackOffice routes
  {
    path: 'admin',
    component: AdminLayoutComponent,
    children: [
      { path: 'dashboard', component: HomeComponent },
      { path: 'admin2', component: AdminLayoutComponent },
      { path: 'user', component: UserComponent },
      { path: 'table', component: TablesComponent },
      { path: 'typography', component: TypographyComponent },
      { path: 'icons', component: IconsComponent },
      { path: 'maps', component: MapsComponent },
      { path: 'notifications', component: NotificationsComponent },
      { path: 'upgrade', component: UpgradeComponent },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
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
      useHash: true,
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}