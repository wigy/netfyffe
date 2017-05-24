import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router';
import { HttpModule }    from '@angular/http';
import { BrowserAnimationsModule }    from '@angular/platform-browser/animations';
import { NgxChartsModule } from '@swimlane/ngx-charts';

import { AppComponent }  from './app.component';
import { MenuComponent }  from './components/menu.component';
import { HistoryGraphComponent }  from './components/history_graph.component';
import { DashboardComponent } from './pages/dashboard';
import { AccountsComponent }   from './pages/accounts';
import { AccountComponent }   from './pages/account';
import { HistoryComponent }   from './pages/history';
import { PortfolioService } from './services/portfolio.service';

const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'dashboard',  component: DashboardComponent },
  { path: 'accounts/:id',  component: AccountComponent },
  { path: 'accounts',  component: AccountsComponent },
  { path: 'history',  component: HistoryComponent },
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
class AppRoutingModule {}

@NgModule({
  imports: [
    AppRoutingModule,
    BrowserModule,
    HttpModule,
    NgxChartsModule,
    BrowserAnimationsModule,
  ],
  declarations: [
    AppComponent,
    DashboardComponent,
    AccountsComponent,
    AccountComponent,
    MenuComponent,
    HistoryComponent,
    HistoryGraphComponent,
  ],
  providers: [
    PortfolioService,
  ],
  bootstrap: [
    AppComponent
  ]
})
export class AppModule { }
