const rp = require('request-promise');
const express = require('express');
const moment = require('moment');
const config = require('../config');

const ticker = express.Router();

/**
 * Helper to check existence of the harvester module and instantiating it.
 *
 * The harvester module is a module exporting a class with the following methods:
 *
 *      engine.getDailyData(ticker, start, end)
 *        =>  [{date: '2017-03-27', open: 1.00, close: 1.02, high: 1.05, low: 0.99, ticker: 'ABC', volume: 12000}, ...]
 *
 */
function harvester(res) {

    const harvester = config.harvester_module;

    if (!harvester) {
        res.status(500).send("The harvester module is not defined in NETFYFFE_HARVEST environment variable.");
        return null;
    }

    return new (require(harvester))(rp);
}

/**
 * @api {get} /ticker/:code/:start/:end Collect daily data for an instrument.
 * @apiName QuoteData
 * @apiGroup Ticker
 *
 * @apiParam {String} ticker Instrument ticker code.
 * @apiParam {String} start First date of the range as YYYY-MM-DD.
 * @apiParam {String} end Last date of the range as YYYY-MM-DD.
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     [{
 *       "ticker": "FOO:BAR",
 *       "date": "2017-01-03",
 *       "open": 10.01
 *       "close": 10.23
 *       "low": 9.97
 *       "high": 10.12
 *       "volume": 12900
 *     }, {
 *       "ticker": "FOO:BAR",
 *       "date": "2017-01-04",
 *       "open": 10.23
 *       "close": 10.36
 *       "low": 10.11
 *       "high": 10.44
 *       "volume": 1500
 *     }]
 *
 * @apiError UserNotFound The ticker was not found.
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 404 Not Found
 *     {
 *       "error": "TickerNotFound"
 *     }
 */
ticker.get('/:ticker([A-Z0-9:]+)/:start(\\d{4}-\\d{2}-\\d{2})/:end(\\d{4}-\\d{2}-\\d{2})', (req, res) => {

    const {ticker, start, end} = req.params;
    const engine = harvester(res);

    if (engine) {
        d.info('Fetching from', start, 'to', end, 'for', ticker);
        engine.getDailyData(ticker, start, end)
        .then(data => {
            // Prepare fast lookup table per date.
            let lookup = {};
            data.map(q => lookup[q.date]=q);
            // Fill in gaps in the date range by creating new entries.
            let latest = null;
            let ret = [];
            for(let s = moment(start), e = moment(end); s.diff(e) <= 0; s.add(1,'day')) {
                let day = s.format('YYYY-MM-DD');
                if (lookup[day]) {
                    ret.push(lookup[day]);
                    latest = lookup[day].close;
                } else if (latest !== null) {
                    d.info('Filling a gap for', ticker, 'on', day);
                    ret.push({date: day, open: latest, close: latest, high: latest, low: latest, ticker: ticker, volume: 0});
                }
            }
            res.send(ret);
        })
        .catch(err => {
            d.error(err);
            res.status(404).send({error: 'TickerNotFound'});
        });
    }
});

module.exports = ticker;
