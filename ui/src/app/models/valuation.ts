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
     * Construct a list of portfolio valutations for the given date ranges.
     */
    public static make(portfolio: Portfolio, what: string[], allValues=false): Valuation[] {
        return Dates.make(what).map(dates => {
            let q = new Query(dates, null, allValues);
            return new Valuation(q, portfolio.query(q));
        });
    }
}
