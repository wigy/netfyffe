import { Dates } from './dates';
import { Query } from './query';
import { Values } from './values';

export class Balances {

    balances: Object;

    constructor(data: any) {
        this.balances = data || {};
    }

    /**
     * Calculate first day that has a balance recording.
     */
    firstDate(): string {
        let keys = Object.keys(this.balances);
        return keys.length ? keys[0] : new Date().toISOString().substr(0, 10);
    }

    /**
     * Calculate daily valuations for the given date range.
     */
    values(from: string, to: string) {
        // TODO: Obsolete. Remove once not needed.
        let keys = Object.keys(this.balances);
        return keys.map(day => new Object({name: new Date(day), value: this.balances[day] / 100}));
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
     * Calculate valuations for the given query.
     */
    public query(query: Query): Values {
        if (!query.currency) {
            throw Error('Cannot query `Balances` without defining currency in the query.');
        }
        if (query.dates.isSingleDay()) {
            let closing = {};
            closing[query.currency] = this.closing(query.dates);
            return new Values({closing: closing, quotes: {}, opening: {}});
        }
        if (query.dates.isDateRange()) {
            let opening = {};
            opening[query.currency] = this.opening(query.dates);
            let closing = {};
            closing[query.currency] = this.closing(query.dates);
            let quotes = {};
            quotes[query.currency] = {};
            if (query.allValues) {
                let day = query.start();
                while (!day.end()) {
                    quotes[query.currency][day.first] = this.closing(day, true);
                    day.inc();
                }
                quotes[query.currency][day.first] = closing[query.currency];
            }
            return new Values({closing: closing, quotes: quotes, opening: opening});
        }
        throw Error('Query not yet implemented.');
    }
}
