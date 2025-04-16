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
import { GetofferComponent } from './FrontOffice/Offer/getoffer/getoffer.component';
import { AddofferComponent } from './FrontOffice/Offer/addoffer/addoffer.component';
import { UpdateofferComponent } from './FrontOffice/Offer/updateoffer/updateoffer.component';
import { ViewOffersComponent } from './FrontOffice/Offer/view-offers/view-offers.component';
import { ChartsComponent } from './BackOffice/OfferCharts/charts/charts.component';
import { DashboardComponent } from './BackOffice/dashboard/dashboard.component';
import { InsuranceComponent } from './BackOffice/insurance/insurance.component';
import { InsuranceChartsComponent } from './BackOffice/insurance/insurance-charts/insurance-charts.component';
import { AddInsuranceComponent } from './BackOffice/insurance/add-insurance/add-insurance.component';
import { UpdateInsuranceComponent } from './BackOffice/insurance/update-insurance/update-insurance.component';
import { ViewInsuranceComponent } from './FrontOffice/insurance/view-insurance/view-insurance.component';

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
  {path:'app-view-offers', component:ViewOffersComponent},
  {path:'app-view-insurance', component:ViewInsuranceComponent},

 
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
         { path: 'addoffer',component:AddofferComponent},
         { path: 'getoffer',component:GetofferComponent},
         { path: 'updateoffer/:id', component: UpdateofferComponent },
         {path: 'app-charts', component: ChartsComponent},
         {path: 'app-dashboard',component: DashboardComponent},
         {path: 'insurance', component: InsuranceComponent},
         { path: 'insurance/add', component: AddInsuranceComponent },
         { path: 'insurance/update/:id', component: UpdateInsuranceComponent },
         { path: 'insurance-charts', component: InsuranceChartsComponent },
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
