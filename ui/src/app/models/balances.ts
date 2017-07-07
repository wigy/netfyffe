import { Account } from './account';
import { Dates } from './dates';
import { Query } from './query';
import { Values } from './values';

export class Balances {

    constructor(public account: Account, public balances: any = {}) { }

    /**
     * Calculate first day that has a balance recording.
     */
    firstDate(): string {
        let keys = Object.keys(this.balances);
        return keys.length ? keys[0] : new Date().toISOString().substr(0, 10);
    }

    /**
     * Calculate closing value for the day.
     */
    closing(day: Dates, useFirstDay=false): number {
        let keys = Object.keys(this.balances);
        if (!keys.length) {
            return 0;
        }
        let str = useFirstDay ? day.first : day.last;
        if (keys[0] > str) {
            return 0;
        }
        // TODO: Check if we have right date value already.
        // TODO: Inefficient lookup. Use https://www.npmjs.com/package/binary-search-bounds
        let i = 1;
        while (keys[i] <= str && i < keys.length) {
            i++;
        }
        // TODO: Store the value as well?
        return this.balances[keys[i-1]];
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
            throw Error('Cannot query `Balances` or `Capital` without defining currency in the query.');
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

    /**
     * Calculate valuations for the given query.
     */
    public query(query: Query): Values {
        return new Values(this._query(query));
    }
}
