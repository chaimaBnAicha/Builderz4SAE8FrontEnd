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
import { StockComponent } from './BackOffice/stock/stock.component';
import { StockEditComponent } from './BackOffice/stock/stock-edit/stock-edit.component';

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

  // BackOffice routes
  {
    path: 'admin',
    component: AdminLayoutComponent,
    children: [
          { path: 'dashboard',      component: HomeComponent },
         { path: 'home',           component: HomeComponent },
         { path: 'admin2',         component: AdminLayoutComponent },
         { path: 'user',           component: UserComponent },
         { path: 'table',          component: TablesComponent },
         { path: 'typography',     component: TypographyComponent },
         { path: 'icons',          component: IconsComponent },
         { path: 'maps',           component: MapsComponent },
         { path: 'notifications',  component: NotificationsComponent },
         { path: 'upgrade',        component: UpgradeComponent },
         { path: 'stock',          component: StockComponent },
         { path: 'stock/edit/:id', component: StockEditComponent },
         { path: 'bill',           loadChildren: () => import('./BackOffice/bill/bill.module').then(m => m.BillModule) },
      // Add other backoffice child routes here
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
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
