const rp = require('request-promise');
const moment = require('moment');
const splitArray = require('split-array');
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

        cache[ticker] = cache[ticker] || {};

        // Do not let `end` to be today or in future.
        if (end >= moment().format('YYYY-MM-DD')) {
            end = moment().subtract(1, 'day').format('YYYY-MM-DD');
        }

        // Check cache if we have data already.
        let days = moment(end).diff(moment(start), 'days') + 1;
        let holes = false;
        let hits = [];

        for(let s = moment(start), e = moment(end); s.diff(e) <= 0; s.add(1,'day')) {
            let day = s.format('YYYY-MM-DD');
            if (!cache[ticker][day]) {
                holes = true;
                break;
            }
            hits.push(cache[ticker][day]);
        }

        // Return cached data.
        if (!holes) {
            d.info('Returning cached data for', ticker, 'from', start, 'to', end);
            return Promise.resolve(hits);
        }

        return db('quotes').select('*').where('date', '>=', start).andWhere('date', '<=', end).andWhere('ticker', ticker)
            .then(data => {
                // Fill in cache.
                data.map(entry => cache[ticker][entry.date] = entry);

                // Check if there are enough entries.
                if (data.length === days) {
                    d.info('Found all', data.length, 'entries from database for', ticker);
                    return data;
                }

                // Expand the range if it is small.
                if (moment(end).diff(moment(start), 'days') < 30) {
                    d.info('Expanding range from', start, 'to', end, 'to 30 days');
                    start = moment(end).subtract(30, 'days').format('YYYY-MM-DD');
                }

                // Fetch from the harvest.
                let uri = config.harvest + '/ticker/' + ticker + '/' + start + '/' + end;
                d.info('Fetching', uri);
                return rp({uri: uri, json: true});
            })
            .then(data => {
                // Construct second array for entries not found from cache.
                let fresh = data.filter(entry => !cache[ticker][entry.date]);
                // Fill in cache.
                fresh.map(entry => cache[ticker][entry.date] = entry);
                return [data, fresh];
            })
            .then(result => {
                // Insert fresh data to database.
                let [data, fresh] = result;
                if (fresh.length) {
                    d.info('Adding', fresh.length, 'new entries to database for', ticker);
                    return Promise.all(splitArray(fresh,config.dbWriteChunkSize).map(chunk => db('quotes').insert(chunk)))
                        .then(() => {
                            return data;
                        });
                } else {
                    return data;
                }
            });
    }
};