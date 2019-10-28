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
import { Config } from '../config';

@Injectable()
export class QuoteService {

    constructor(private http: Http, private config: Config) { }

    /**
    * Subscribe to the observable updating quotes related to the Portfolio.
    */
    public subscribe(portfolio: Portfolio, dates: Dates[]|string[], callback: () => void): void {

        // TODO: Maybe turn dates argument to be query instead? Then one can limit into single account group.
        if (dates.length && typeof(dates[0]) === 'string') {
            dates = Dates.make(<string[]>dates);
        }

        // Collect single dates and continuous ranges needed.
        let singles = {};
        let ranges: Dates[] = [];

        (<Dates[]>dates).forEach((dd: Dates) => {
            if (dd.hasFullRange) {
                ranges.push(dd);
            } else {
                dd.toArray().forEach(str => singles[str]=true);
            }
        });

        // Fetch ranges seprately.
        ranges.forEach((dates: Dates) => {
            portfolio.tickers().forEach((ticker: string) => {
                const url = this.config.QUOTES_URL + '/quote/' + ticker + '/' + dates.first + '/' + dates.last;
                this.http.get(url)
                    .subscribe(data => {
                        let quotes = new Quotes();
                        quotes.fromArray(data.json());
                        portfolio.update(quotes);
                        callback();
                    });
            });
        });

        // Fetch all single quotes for all tickers in portfolio with POST.
        if (Object.keys(singles).length) {
            const url = this.config.QUOTES_URL + '/quote/';
            this.http.post(url, {tickers: portfolio.tickers(), dates: Object.keys(singles)})
                .subscribe(data => {
                    portfolio.update(new Quotes(data.json()));
                    callback();
                });
        }

        // TODO: Fetch real values for currency rates.
        // TODO: Start updating regularly the latest quotes if today is among the dates.
    }
}
