import { Account } from './account';
import { Dates } from './dates';
import { Query } from './query';
import { Values } from './values';

/**
 * A helper class to implement query for classes that provide `closing(date)` function.
 */
export class DailyValues {

    /**
     * A function to calculate closing value is needed.
     */
    closing(day: Dates, useFirstDay=false): number {
        throw Error('Function closing() not implemented.');
    }

    /**
     * Calculate opening value for the day.
     */
    opening(day: Dates): number {
        return this.closing(day.dayBefore());
    }

    /**
     * Helper to calculate valuations for the given query.
     */
    protected _query(query: Query): {opening: {}; quotes: {}; closing: {}} {
        if (!query.currency) {
            throw Error('Cannot query `DailyValyes` without defining currency in the query.');
        }
        if (query.dates.isSingleDay()) {
            let closing = {};
            closing[query.currency] = this.closing(query.dates);
            return {closing: closing, quotes: {}, opening: {}};
        }
        if (query.dates.isDateRange()) {
            let opening = {};
            opening[query.currency] = this.opening(query.dates);
            let closing = {};
            closing[query.currency] = this.closing(query.dates);
            let quotes = {};
            quotes[query.currency] = {};
            if (query.dates.hasFullRange) {
                let day = query.start();
                while (!day.end()) {
                    quotes[query.currency][day.first] = this.closing(day, true);
                    day.inc();
                }
                quotes[query.currency][day.first] = closing[query.currency];
            }
            return {closing: closing, quotes: quotes, opening: opening};
        }
        throw Error('Query not yet implemented.');
    }
}
