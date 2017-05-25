import { Dates } from './dates';
import { Values } from './values';

/**
 * A filtering description for calculating values and value changes for portfolios and accounts.
 *
 * If a single date is given, then the value is the closing value (or the latest known, if today)
 * of the target. If the range is given, then opening and closing (or the latest) with difference
 * is returned.
 */
export class Query {

    constructor(public dates: Dates, public currency=<string>null) {}

    /**
     * Make a copy of this query.
     */
    public clone(): Query {
        return new Query(this.dates, this.currency);
    }

    /**
     * Check if this query accepts the given currency.
     */
    public acceptsCurrency(currency: string): boolean {
        if (this.currency === null) {
            return true;
        }
        return this.currency === currency;
    }

    /**
     * Construct new query from this query by limiting currency to the given currency.
     */
    public withCurrency(currency: string): Query {
        let ret = this.clone();
        ret.currency = currency;
        return ret;
    }

    /**
     * Construct a query.
     */
    public static build(day: string) : Query;
    public static build(day: string|Dates) : Query {
        if (!(day instanceof Dates)) {
            day = new Dates(day);
        }
        let ret = new Query(day);
        return ret;
    }
}
