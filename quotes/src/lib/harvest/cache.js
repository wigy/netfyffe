const rp = require('request-promise');
const config = require('../../config');
const db = require('../../db');

/**
 * A memory caching front end to the quote retrieval.
 */
let cache = {};

module.exports = {

    // TODO: Check for existing data.
    // TODO: Add mocha tests using mocked harvester.
    // TODO: Use cache.
    // TODO: Store data.
    /**
     * Provide data for a ticker for the given date range (inclusive).
     */
    quotes(ticker, start, end) {
        let uri = config.harvest + '/ticker/' + ticker + '/' + start + '/' + end;
        d.info('Fetching', uri);
        return rp({uri: uri}).then(data => {
            db.insert(data).into('quotes');
            return data;
        });
    }
};