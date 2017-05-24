import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { PortfolioService } from '../services/portfolio.service';
import { Portfolio } from '../models/portfolio';
import { Dates } from '../models/dates';

@Component({
  templateUrl: './history.html',
})
export class HistoryComponent implements OnInit  {

  portfolio: Portfolio;
  data: any[];

  constructor(private portfolioService: PortfolioService, private route: ActivatedRoute) {
    this.portfolio = new Portfolio();
    this.data = [];
  }

  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {
      this.portfolioService.getPortfolio()
        .then(portfolio => {
          this.portfolio = portfolio;
          d(Dates.make('1Y').toArray())
        });
    });
  }
}
