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
        let days = 0;
        let holes = false;
        let hits = [];

        // TODO: Get rid of silly ways of counting days.
        for(let s = moment(start), e = moment(end); s.diff(e) <= 0; s.add(1,'day')) {
            let day = s.format('YYYY-MM-DD');
            if (!cache[ticker][day]) {
                holes = true;
            }
            // If there are holes, no point to collect results but we are still counting the days.
            if (!holes) {
                hits.push(cache[ticker][day]);
            }
            days++;
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
                d.info('Found', data.length, 'entries from database for', ticker);
                if (days === data.length) {
                    return data;
                }

                // Fetch from the harvest.
                let uri = config.harvest + '/ticker/' + ticker + '/' + start + '/' + end;
                d.info('Fetching', uri);
                return rp({uri: uri, json: true});
            })
            .then(data => {
                // Construct second array for entries not found from cache.
                let fresh = data.filter(entry => !cache[ticker][entry.date]);
                d.info('Got', data.length, 'entries for', ticker, 'with', fresh.length, 'new entries');
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