import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { PortfolioService } from '../services/portfolio.service';
import { AccountGroup } from '../models/account_group';

@Component({
  templateUrl: './account.html',
})
export class AccountComponent implements OnInit  {

  accountGroup: AccountGroup;

  constructor(private portfolio: PortfolioService, private route: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.route.params.subscribe(
      (params: Params) => this.portfolio.getAccountGroup(params['id'])
        .then(data => console.log(data))
    )
  }
}
