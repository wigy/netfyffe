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
                // TODO: All values are turned on just for testing.
                this.quarterDates = Valuation.make(this.portfolio, portfolio.quarters(), true);
                this.recentDates = Valuation.make(this.portfolio, ['1D', '1W', '1M', '3M', '6M', 'YTD', '1Y', '3Y', '5Y']);
            });
        });
    }
}
