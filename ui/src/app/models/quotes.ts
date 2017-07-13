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
        // TODO: Use yesterdy always for today's substitute, if available.
        // TODO: Handle null entries, i.e. gaps by looking for previous.
        let str: string = typeof(day) === 'string' ? day : day.first;
        if (this.data[ticker] && this.data[ticker][str]) {
            return this.data[ticker][str].close;
        }
        return null;
    }
}
