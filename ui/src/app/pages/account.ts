import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { PortfolioService } from '../services/portfolio';
import { AccountGroup } from '../models/account_group';
import { Account } from '../models/account';

@Component({
    templateUrl: './account.html',
})
export class AccountPage implements OnInit  {

    accountGroup: AccountGroup;
    data: any[];

    constructor(private portfolioService: PortfolioService, private route: ActivatedRoute) {
        this.accountGroup = new AccountGroup({});
        this.data = [];
    }

    ngOnInit(): void {
        this.route.params.subscribe((params: Params) => {
            this.portfolioService.transactions(+params['id'], (group: AccountGroup) => {
                this.accountGroup = group;
                this.data = group.getGraphData();
                // TODO: Subscribe to quote updates via portfolio. Note: needs continuous date ranges.
            });
        });
    }
}
