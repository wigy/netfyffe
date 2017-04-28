import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router';

import { AppComponent }  from './app.component';
import { MenuComponent }  from './components/menu.component';
import { DashboardComponent } from './pages/dashboard';
import { AccountsComponent }   from './pages/accounts';

const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'dashboard',  component: DashboardComponent },
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
    BrowserModule
  ],
  declarations: [
    AppComponent,
    DashboardComponent,
    AccountsComponent,
    MenuComponent,
  ],
  bootstrap: [
    AppComponent
  ]
})
export class AppModule { }
