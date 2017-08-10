import * as moment from 'moment/moment';
import { Dates } from '../models/dates';

/**
 * A collection of known values for the given ticker.
 *
 * This class is mainly used as a message passing updates from the service to the portfolio.
 * Data content is simply
 * {
 *   "TICKER1": {
 *     "2001-01-01": {"close": 12.0, ...},
 *     "2001-01-02": {"close": 12.3, ...},
 *     "2001-01-03": {"close": 11.9, ...}
 *   },
 *   "TICKER1": {
 *     ...
 *   }
 * }
 */
export class Quotes {

    constructor(public data: Object = {}) {}

    /**
     * Override updated quotes to this object.
     */
    public merge(update: Quotes): void {
        Object.keys(update.data).forEach(ticker => {
            this.data[ticker] = this[ticker] || {};
            this.data[ticker] = Object.assign(this.data[ticker], update.data[ticker]);
        });
    }

    /**
     * Check if we know quote for the given date for a ticker.
     */
    public closing(ticker: string, day: Dates|string): number|null {
        let str: string = typeof(day) === 'string' ? day : day.first;
        if (this.data[ticker] && this.data[ticker][str]) {
            if (this.data[ticker][str].close === null) {
                // Check the previous 7 days for value.
                let day = moment(str);
                for (let i = 0; i < 7; i++) {
                    day.subtract(1, 'days');
                    let old = day.format('YYYY-MM-DD');
                    if (this.data[ticker][old] && this.data[ticker][old].close !== null) {
                        this.data[ticker][str] = this.data[ticker][old];
                        return this.data[ticker][old].close;
                    }
                }
                return null;
            }
            return this.data[ticker][str].close;
        }
        return null;
    }

    /**
     * Collect quote data from the array format
     * [
     *   {
     *     "ticker": "ABC",
     *     "date": "2011-01-12",
     *     "close": 1.23
     *   },
     *   {
     *     "ticker": "ABC",
     *     "date": "2011-01-13",
     *     "close": 1.61
     *   },
     *   {
     *     "ticker": "ABC",
     *     "date": "2011-01-14",
     *     "close": 1.02
     *   },
     *   ...
     * ]
     */
    public fromArray(data: any[]) {
        this.data = {};
        data.forEach(quote => {
            this.data[quote.ticker] = this.data[quote.ticker] || {};
            this.data[quote.ticker][quote.date] = quote;
        });
    }
}
