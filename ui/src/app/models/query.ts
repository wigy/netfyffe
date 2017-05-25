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
