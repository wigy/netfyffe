import { Component, OnInit } from '@angular/core';
import { PortfolioService } from '../services/portfolio.service';
import { AccountGroup } from '../models/account_group';

@Component({
  template: `<h2>Accounts</h2>`,
})
export class AccountsComponent implements OnInit  {

  constructor(private portfolio: PortfolioService) {
  }

  ngOnInit(): void {
    this.portfolio.getAccounts()
      .then((data: AccountGroup[]) => console.log(data));
  }
}
