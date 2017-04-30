import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router';
import { HttpModule }    from '@angular/http';

import { AppComponent }  from './app.component';
import { MenuComponent }  from './components/menu.component';
import { DashboardComponent } from './pages/dashboard';
import { AccountsComponent }   from './pages/accounts';
import { AccountComponent }   from './pages/account';
import { PortfolioService } from './services/portfolio.service';

const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'dashboard',  component: DashboardComponent },
  { path: 'accounts/:id',  component: AccountComponent },
  { path: 'accounts',  component: AccountsComponent },
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
  ],
  declarations: [
    AppComponent,
    DashboardComponent,
    AccountsComponent,
    AccountComponent,
    MenuComponent,
  ],
  providers: [
    PortfolioService,
  ],
  bootstrap: [
    AppComponent
  ]
})
export class AppModule { }
