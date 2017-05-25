import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { PortfolioService } from '../services/portfolio.service';
import { Portfolio } from '../models/portfolio';
import { Dates } from '../models/dates';
import { Query } from '../models/query';

@Component({
  templateUrl: './history.html',
})
export class HistoryComponent implements OnInit  {

  portfolio: Portfolio;
  data: any[];
  recentDates: Dates[];
  quarterDates: Dates[];

  constructor(private portfolioService: PortfolioService, private route: ActivatedRoute) {
    this.portfolio = new Portfolio();
    this.data = [];
    this.recentDates = Dates.make(['1D', '1W', '1M', '3M', '6M', 'YTD', '1Y', '3Y', '5Y']);
    this.quarterDates = [];
  }

  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {
      this.portfolioService.getPortfolio()
        .then(portfolio => {
          this.portfolio = portfolio;
          // TODO: Calculate quarter dates applicapable to the portfolio.
          this.quarterDates = Dates.make(['2016Q1', '2016Q2', '2016Q3', '2016Q4', '2017Q1', '2016Q2']);

          // TODO: Just testing here.
          let q1 = Query.build('2016-06-01');
          let q2 = Query.build('2016-08-04');
          let q3 = Query.build('2016-08-03');
          let q4 = Query.build('2017-01-01', '2017-04-30');
          d(portfolio.query(q4));

        });
    });
  }
}
