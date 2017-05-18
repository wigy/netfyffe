import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { PortfolioService } from '../services/portfolio.service';
import { AccountGroup } from '../models/account_group';
import { Account } from '../models/account';

@Component({
  templateUrl: './account.html',
})
export class AccountComponent implements OnInit  {

  accountGroup: AccountGroup;

  constructor(private portfolio: PortfolioService, private route: ActivatedRoute) {
    this.accountGroup = new AccountGroup({});
  }

  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {
      this.portfolio.getAccountGroup(+params['id'])
        .then(group => Promise.all(group.accounts.map(account => Promise.all([
                this.portfolio.getBalances(account.id),
                this.portfolio.getInstruments(account.id)
          ])
          .then(data => {
            account.balances = data[0];
            account.instruments = data[1];
            return account;
          }))
        ).then(() => this.accountGroup = group));
    });
  }
}
