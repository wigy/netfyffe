import { Component, OnInit } from '@angular/core';
import { PortfolioService } from '../services/portfolio.service';

@Component({
  template: `<h2>Accounts</h2>`,
})
export class AccountsComponent implements OnInit  {

  constructor(private portfolio: PortfolioService) {
  }

  ngOnInit(): void {
    this.portfolio.getPortfolio()
      .then((data: Object[]) => console.log(data));
  }
}
