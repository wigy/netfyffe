import { Component, OnInit } from '@angular/core';
import { PortfolioService } from '../services/portfolio';
import { AccountGroup } from '../models/account_group';

@Component({
    templateUrl: './accounts.html',
})
export class AccountsPage implements OnInit  {

    accountGroups: AccountGroup[];

    constructor(private portfolio: PortfolioService) {
    }

    ngOnInit(): void {
        this.portfolio.getAccountGroups()
          .then((data: AccountGroup[]) => this.accountGroups = data);
    }
}
