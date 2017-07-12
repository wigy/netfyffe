import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Portfolio } from '../models/portfolio';
import { Quotes } from '../models/quotes';
import { Dates } from '../models/dates';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/delay';

@Injectable()
export class QuoteService {
    // TODO: Make configurable.
    private url: string = 'http://localhost:9000';
    // Target portfolio to collect quotes for.
    private portfolio: Portfolio = null;

    constructor(private http: Http) { }

    /**
    * Subscribe to the observable updating quotes related to the Portfolio.
    */
    subscribe(portfolio: Portfolio, dates: Dates[]|string[], callback: Function): void {
        if (dates.length && typeof(dates[0]) === 'string') {
            dates = Dates.make(<string[]>dates);
        }
        // Construct a full list of dates needed.
        let needs = {};
        (<Dates[]>dates).map((date: Dates) => {
            date.toArray().forEach(str => needs[str]=true);
        });

        const url = this.url + '/quote/';
        this.http.post(url, {tickers: portfolio.tickers(), dates: Object.keys(needs)})
            .subscribe(data=> {
                d(data);
            });

        // TODO: Fetch real values for currency rates.
    }
}
