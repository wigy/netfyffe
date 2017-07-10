import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { PortfolioService } from '../services/portfolio';
import { QuoteService } from '../services/quotes';
import { Portfolio } from '../models/portfolio';
import { Valuation } from '../models/valuation';
import { Query } from '../models/query';

@Component({
    templateUrl: './history.html',
})
export class HistoryPage implements OnInit  {

    portfolio: Portfolio;
    data: any[];
    historical: Valuation[];
    quarters: Valuation[];

    constructor(private portfolioService: PortfolioService, private quoteService: QuoteService, private route: ActivatedRoute) {
        this.portfolio = new Portfolio();
        this.data = [];
        this.historical = [];
        this.quarters = [];
    }

    ngOnInit(): void {
        this.route.params.subscribe((params: Params) => {

            this.portfolioService.subscribe((portfolio: Portfolio) => {
                this.portfolio = portfolio;
//                this.quarters = Valuation.make(this.portfolio, portfolio.quarters());
//                this.historical = Valuation.make(this.portfolio, ['1D', '1W', '1M', '3M', '6M', 'YTD', '1Y', '3Y', '5Y']);
                this.historical = Valuation.make(this.portfolio, ['2017Q1', '2017Q2']);
                // TODO: Construct dates.
                this.quoteService.subscribe(this.portfolio, [], () => {
                    // TODO: Refresh valuations.
                });
            });
        });
    }
}
