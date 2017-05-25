import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { PortfolioService } from '../services/portfolio.service';
import { Portfolio } from '../models/portfolio';
import { Valuation } from '../models/valuation';
import { Query } from '../models/query';

@Component({
    templateUrl: './history.html',
})
export class HistoryComponent implements OnInit  {

    portfolio: Portfolio;
    data: any[];
    recentDates: Valuation[];
    quarterDates: Valuation[];

    constructor(private portfolioService: PortfolioService, private route: ActivatedRoute) {
        this.portfolio = new Portfolio();
        this.data = [];
        this.recentDates = [];
        this.quarterDates = [];
    }

    ngOnInit(): void {
        this.route.params.subscribe((params: Params) => {
            this.portfolioService.getPortfolio()
            .then(portfolio => {
                this.portfolio = portfolio;
                // TODO: Calculate quarter dates applicapable to the portfolio.
                this.quarterDates = Valuation.make(this.portfolio, ['2016Q1', '2016Q2', '2016Q3', '2016Q4', '2017Q1', '2017Q2']);
                this.recentDates = Valuation.make(this.portfolio, ['1D', '1W', '1M', '3M', '6M', 'YTD', '1Y', '3Y', '5Y']);
            });
        });
    }
}
