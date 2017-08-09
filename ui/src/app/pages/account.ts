import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { PortfolioService } from '../services/portfolio';
import { QuoteService } from '../services/quotes';
import { AccountGroup } from '../models/account_group';
import { Account } from '../models/account';
import { Dates } from '../models/dates';
import { Quotes } from '../models/quotes';

@Component({
    templateUrl: './account.html',
})
export class AccountPage implements OnInit  {

    accountGroup: AccountGroup;
    data: any[];

    constructor(private portfolioService: PortfolioService, private quoteService: QuoteService, private route: ActivatedRoute) {
        this.accountGroup = new AccountGroup({});
        this.data = [];
    }

    ngOnInit(): void {
        this.route.params.subscribe((params: Params) => {
            this.portfolioService.transactions(+params['id'], (group: AccountGroup) => {
                this.accountGroup = group;
                this.data = group.getGraphData();

                let start = group.portfolio.firstDate();
                let end = group.portfolio.lastDate();
                let range = new Dates(group.name + ' range', start, end).useFullRange();

                this.quoteService.subscribe(this.accountGroup.portfolio, [range], () => {
                    this.data = group.getGraphData();
                });
            });
        });
    }
}
