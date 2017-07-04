import { Portfolio } from './portfolio';
import { Dates } from './dates';
import { Query } from './query';
import { Values } from './values';

/**
 * A storage for a query and for the result of the query.
 */
export class Valuation {

    constructor(public query: Query, public results=<Values>null) {}

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
    opening(currency: string, deductCapital: boolean=false): Number {
        return this.results.data.opening[currency] - (
            deductCapital ? this.results.capital.data.opening[currency] : 0
        );
    }

    /**
     * Get the closing value for the currency.
     */
    closing(currency: string, deductCapital: boolean=false): Number {
        return this.results.data.closing[currency] - (
            deductCapital ? this.results.capital.data.closing[currency] : 0
        );
    }

    /**
     * Construct a list of portfolio valutations for the given date ranges.
     */
    public static make(portfolio: Portfolio, what: string[], allValues=false): Valuation[] {
        return Dates.make(what).map(dates => {
            let q = new Query(dates, null, allValues);
            return new Valuation(q, portfolio.query(q));
        });
    }
}
