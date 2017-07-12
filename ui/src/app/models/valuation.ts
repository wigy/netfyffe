import { Portfolio } from './portfolio';
import { Dates } from './dates';
import { Query } from './query';
import { Values } from './values';

/**
 * A storage for a query and for the result of the query.
 */
export class Valuation {

    constructor(public portfolio: Portfolio, public query: Query, public results=<Values>null) {}

    /**
     * Get the name of the date range used.
     */
    get name(): string {
        return this.query.dates.name;
    }

    /**
     * Get the list of currencies seen in this valuation.
     */
    get currencies(): string[] {
        return Object.keys(this.results.data.closing);
    }

    /**
     * Get the opening value for the currency.
     */
    public opening(currency: string, deductCapital: boolean=false): number {
        return this.results.data.opening[currency] - (
            deductCapital ? this.results.capital.data.opening[currency] : 0
        );
    }

    /**
     * Get the closing value for the currency.
     */
    public closing(currency: string, deductCapital: boolean=false): number {
        return this.results.data.closing[currency] - (
            deductCapital ? this.results.capital.data.closing[currency] : 0
        );
    }

    /**
     * Construct a summary how valuation has been calculated.
     */
    public explain(): Object {
        let ret = {};
        let firstDate = this.query.dates.first;
        let lastDate = this.query.dates.last;
        let portfolioExplanations = this.portfolio.explain(this.query);
        this.currencies.forEach(currency => {
            ret[currency] = [];
            let oc = this.results.capital.data.opening[currency]/100;
            let cc = this.results.capital.data.closing[currency]/100;
            ret[currency].push('Opening capital ' + currency + ' on ' + firstDate + ' is ' + oc);
            ret[currency] = ret[currency].concat(portfolioExplanations[currency]);
            ret[currency].push('Closing capital ' + currency + ' on ' + lastDate + ' is ' + cc);
            ret[currency].push('Capital change ' + currency + ' ' + (this.results.capital.data.closing[currency]
              - this.results.capital.data.opening[currency])/100);
            let opening = portfolioExplanations[currency + '-opening'];
            let closing = portfolioExplanations[currency + '-closing'];
            let o = opening.reduce((a: number, b: number) => a+b, 0);
            let c = closing.reduce((a: number, b: number) => a+b, 0);
            ret[currency].push('Opening value ' + opening.join(' + ') + ' = ' + o + ' (minus capital ' + (o-oc) + ')');
            ret[currency].push('Closing value ' + closing.join(' + ') + ' = ' + c + ' (minus capital ' + (c-cc) + ')');
            let profit = ((c-cc) - (o-oc));
            ret[currency].push('Total profit for period ' +firstDate + ' ' + lastDate + ' is ' + profit + ' ' + (profit / o) + '%');
        });
        return ret;
    }

    /**
     * Construct a list of portfolio valutations for the given date ranges.
     */
    public static make(portfolio: Portfolio, what: string[]): Valuation[] {
        return Dates.make(what).map(dates => {
            let q = new Query(dates);
            return new Valuation(portfolio, q, portfolio.query(q));
        });
    }
}
