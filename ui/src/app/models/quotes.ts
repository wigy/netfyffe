/**
 * A collection of known values for the given ticker.
 *
 * This class is mainly used as a message passing updates from the service to the portfolio.
 * Data content is simply
 * {
 *   "TICKER1": {
 *     "2001-01-01": 12.0,
 *     "2001-01-02": 12.3,
 *     "2001-01-03": 11.9
 *   },
 *   "TICKER1": {
 *     ...
 *   }
 * }
 */
export class Quotes {

    constructor(public data: Object = {}) {}
}
