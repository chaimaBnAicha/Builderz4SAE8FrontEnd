import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router';

import { AdminLayoutComponent } from './BackOffice/layouts/admin-layout/admin-layout.component';
import { IndexComponent } from './FrontOffice/index/index.component';

import { ContactComponent } from './FrontOffice/contact/contact.component';
import { PortfolioComponent } from './FrontOffice/portfolio/portfolio.component';
import { ServiceComponent } from './FrontOffice/service/service.component';

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
import {AdvanceComponent} from './FrontOffice/advance/advance/advance.component';
import { AddAdvanceComponent } from './FrontOffice/advance/add-advance/add-advance.component';
import { UpdateAdvanceComponent } from './FrontOffice/advance/update-advance/update-advance.component';
import { AdvanceBackComponent } from './BackOffice/Advance/advance-back/advance-back.component';
import { PieChartComponent } from './BackOffice/AdvanceCharts/pie-chart/pie-chart.component';
import { DashboardComponent } from './BackOffice/dashboard/dashboard.component';
import { BarChartComponent } from './BackOffice/AdvanceCharts/bar-chart/bar-chart.component';
import { SinusoidalComponent } from './BackOffice/AdvanceCharts/sinusoidal/sinusoidal.component';
import { GetleavesComponent } from './FrontOffice/leave/getleaves/getleaves.component';
import { AddleaveComponent } from './FrontOffice/leave/addleave/addleave.component';
import { UpdateleaveComponent } from './FrontOffice/leave/updateleave/updateleave.component';

// Define your routes
const routes: Routes = [
  // FrontOffice routes
  { path: '', component: IndexComponent },
  
  { path: 'about', component: AboutComponent },
  { path: 'contact', component: ContactComponent },
  { path: 'portfolio', component: PortfolioComponent },
  { path: 'service', component: ServiceComponent },
  
  { path: 'team', component: TeamComponent },
  { path: 'test', component: TestComponent },
  {path: 'advance', component:AdvanceComponent},
  {path: 'add-advance', component:AddAdvanceComponent},
  {path: 'update-advance/:id', component:UpdateAdvanceComponent},
  {path: 'leave', component:GetleavesComponent},
  {path: 'addleave',component: AddleaveComponent},
  {path: 'updateleave', component:UpdateleaveComponent},



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
         {path:'advanceback', component:AdvanceBackComponent},
         {path:'app-pie-chart', component:PieChartComponent},
         {path:'app-dashboard',component: DashboardComponent},
         {path:'app-bar-chart', component:BarChartComponent},
         {path:'app-sinusoidal',component:SinusoidalComponent},

      // Add other backoffice child routes here
      { path: '', redirectTo: 'home', pathMatch: 'full' }, // Default route under admin layout
    ],
  },

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
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
