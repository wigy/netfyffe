const rp = require('request-promise');
const config = require('../../config');
const db = require('../../db');

/**
 * A memory caching front end to the quote retrieval.
 */
let cache = {};

module.exports = {

    /**
     * Provide data for a ticker for the given date range (inclusive).
     */
    quotes(ticker, start, end) {
        let uri = config.harvest + '/ticker/' + ticker + '/' + start + '/' + end;
        d.info('Fetching', uri);
        // TODO: Check cache if we have data already.
        // TODO: Fill in everything from database to the cache from the range.
        return rp({uri: uri, json: true})
            .then(data => {
                d.info('Got', data.length, 'entries for', ticker);
                // TODO: Fill cache and construct second array for entries not found.
                return data;
            })
            .then(data => {
                // TODO: Insert only those entries that havent been not found.
                return db('quotes').insert(data).then(() => {return data;});
            });
    }
};