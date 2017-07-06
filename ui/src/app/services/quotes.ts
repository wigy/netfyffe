import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Portfolio } from '../models/portfolio';
import { Quotes } from '../models/quotes';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/delay';
import 'rxjs/add/operator/debounceTime';

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
    static connect(portfolio: Portfolio): Observable<Quotes> {
        let observable = new Subject();
        observable.subscribe((msg : Quotes) => portfolio.update(msg));
        // TODO: Calculate "quick relief", i.e. linear estimates based on buy/sell prices.
        observable.next(new Quotes())
        observable.debounceTime(500);
        // TODO: Fetch real values for instruments.
        // TODO: Fetch real values for currency rates.
        return observable;
    }
}
