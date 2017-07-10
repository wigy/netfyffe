import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router';
import { HttpModule }    from '@angular/http';
import { BrowserAnimationsModule }    from '@angular/platform-browser/animations';
import { NgxChartsModule } from '@swimlane/ngx-charts';

import { AppComponent }  from './app.component';
import { MenuComponent }  from './components/structural/menu';
import { HistoryGraphComponent }  from './components/graphics/history_graph';
import { DashboardPage } from './pages/dashboard';
import { AccountsPage }   from './pages/accounts';
import { AccountPage }   from './pages/account';
import { HistoryPage }   from './pages/history';
import { PortfolioService } from './services/portfolio';
import { QuoteService } from './services/quotes';
import { ChangeDirective }   from './components/data/change';
import { PercentageDirective } from './components/data/percentage';

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
        NgxChartsModule,
        BrowserAnimationsModule,
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
        PercentageDirective,
    ],
    providers: [
        PortfolioService,
        QuoteService,
    ],
    bootstrap: [
        AppComponent
    ]
})
export class AppModule { }
