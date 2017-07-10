import { Account } from './account';
import { DailyValues } from './daily_values';
import { Dates } from './dates';
import { Query } from './query';
import { Values } from './values';

export class Balances extends DailyValues {

    constructor(public account: Account, public balances: any = {}) {
        super();
    }

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
    public closing(day: Dates, useFirstDay=false): number {
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
    public opening(day: Dates): number {
        return this.closing(day.dayBefore());
    }

    /**
     * Calculate valuations for the given query.
     */
    public query(query: Query): Values {
        return new Values(this._query(query));
    }
}
