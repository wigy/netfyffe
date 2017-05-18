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
  data: any[];

  constructor(private portfolio: PortfolioService, private route: ActivatedRoute) {
    this.accountGroup = new AccountGroup({});
    this.data = [];
  }

  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {
      this.portfolio.getAccountGroup(+params['id'])
        .then(group => {
          this.accountGroup = group;
        });
    });
  }
}
