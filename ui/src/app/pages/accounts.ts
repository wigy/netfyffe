import { Component, OnInit } from '@angular/core';
import { PortfolioService } from '../services/portfolio.service';

@Component({
  template: `<h2>Accounts</h2>`,
})
export class AccountsComponent implements OnInit  {

  constructor(private portfolio: PortfolioService) {
  }

  ngOnInit(): void {
    console.log(this.portfolio.getPortfolio());
  }
}
