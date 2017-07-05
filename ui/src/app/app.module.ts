import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router';
import { HttpModule }    from '@angular/http';

import { AppComponent }  from './app.component';
import { MenuComponent }  from './components/structural/menu';
import { HistoryGraphComponent }  from './components/history_graph';
import { DashboardPage } from './pages/dashboard';
import { AccountsPage }   from './pages/accounts';
import { AccountPage }   from './pages/account';
import { HistoryPage }   from './pages/history';
import { PortfolioService } from './services/portfolio.service';
import { ChangeDirective }   from './components/data/change';

const routes: Routes = [
{ path: '', redirectTo: '/dashboard', pathMatch: 'full' },
{ path: 'dashboard',  component: DashboardPage },
{ path: 'accounts/:id',  component: AccountPage },
{ path: 'accounts',  component: AccountsPage },
{ path: 'history',  component: HistoryPage },
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
        DashboardPage,
        AccountsPage,
        AccountPage,
        MenuComponent,
        HistoryPage,
        HistoryGraphComponent,
        ChangeDirective,
    ],
    providers: [
        PortfolioService,
    ],
    bootstrap: [
        AppComponent
    ]
})
export class AppModule { }
