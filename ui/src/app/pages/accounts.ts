import { Component, OnInit } from '@angular/core';
import { PortfolioService } from '../services/portfolio.service';
import { AccountGroup } from '../models/account_group';

@Component({
  templateUrl: './accounts.html',
})
export class AccountsComponent implements OnInit  {

  accountGroups: AccountGroup[];

  constructor(private portfolio: PortfolioService) {
  }

  ngOnInit(): void {
    this.portfolio.getAccounts()
      .then((data: AccountGroup[]) => this.accountGroups = data);
  }
}
