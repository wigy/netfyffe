import { Component, OnInit } from '@angular/core';
import { PortfolioService } from '../services/portfolio';
import { AccountGroup } from '../models/account_group';
import { Portfolio } from '../models/portfolio';

@Component({
    templateUrl: './accounts.html',
})
export class AccountsPage implements OnInit  {

    accountGroups: AccountGroup[];

    constructor(private portfolioService: PortfolioService) {
    }

    ngOnInit(): void {
        this.portfolioService.subscribe((portfolio: Portfolio) => {
            this.accountGroups = portfolio.groups;
        });
    }
}
