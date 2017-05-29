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
    closing(day: Dates): number {
        let keys = Object.keys(this.balances);
        if (!keys.length) {
            return 0;
        }
        let str = day.last;
        if (keys[0] > str) {
            return 0;
        }
        let i = 1;
        while (keys[i] <= str && i < keys.length) {
            i++;
        }
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
            return new Values({closing: closing, range: {}, opening: {}});
        }
        if (query.dates.isDateRange()) {
            let closing = {};
            closing[query.currency] = this.closing(query.dates);
            let opening = {};
            opening[query.currency] = this.opening(query.dates);
            return new Values({closing: closing, range: {}, opening: opening});
        }
        throw Error('Query not yet implemented.');
    }
}
