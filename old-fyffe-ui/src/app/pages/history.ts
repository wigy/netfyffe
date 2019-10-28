import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { PortfolioService } from '../services/portfolio';
import { QuoteService } from '../services/quotes';
import { Portfolio } from '../models/portfolio';
import { Valuation } from '../models/valuation';
import { Query } from '../models/query';
import { Dates } from '../models/dates';
import { Quotes } from '../models/quotes';

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
        const history = ['1D', '1W', '1M', '3M', '6M', 'YTD', '1Y', '3Y', '5Y'];

        this.route.params.subscribe((params: Params) => {

            this.portfolioService.subscribe((portfolio: Portfolio) => {

                const quarters = portfolio.quarters();

                this.portfolio = portfolio;
                this.quarters = Valuation.make(this.portfolio, quarters);
                this.historical = Valuation.make(this.portfolio, history);

                this.quoteService.subscribe(this.portfolio, quarters.concat(history), () => {
                    this.quarters = Valuation.make(this.portfolio, quarters);
                    this.historical = Valuation.make(this.portfolio, history);
                });
            });
        });
    }
}
