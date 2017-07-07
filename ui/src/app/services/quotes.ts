import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Portfolio } from '../models/portfolio';
import { Quotes } from '../models/quotes';
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
    subscribe(portfolio: Portfolio, callback: Function): void {
        // TODO: Calculate "quick relief", i.e. linear estimates based on buy/sell prices.
        callback(new Quotes());
        // TODO: Fetch real values for instruments.
        // TODO: Fetch real values for currency rates.
    }
}
