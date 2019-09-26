const express = require('express');
const moment = require('moment');
const router = express.Router();
const harvestCache = require('../lib/harvest/cache');
const db = require('../db');
const common = require('chronicles_of_node');

/**
* @api {get} /quote Get the list of ticker names.
* @apiVersion 1.0.0
* @apiName TickerList
* @apiGroup Quote
* @apiDescription
*
* Lists all known tickers in the database.
*
* @apiSuccessExample {json} Response example:
*     HTTP/1.1 200 OK
*     [
*        "HEL:ABC",
*        "HEL:DEF",
*        "FRA:ABC",
*        ...
*     ]
*/
router.get('/', (req, res) => {
    db.select('ticker').from('tickers').then(
        data => res.send(data.map(obj => obj.ticker))
    );
});

/**
* @api {post} /quote Get quotes for serveral tickers in different days.
* @apiVersion 1.0.0
* @apiName TickerSpotValues
* @apiGroup Quote
* @apiParam {Array} tickers A list of tickers.
* @apiParam {Array} dates A list of dates in `YYYY-MM-DD` format.
* @apiDescription
*
* Find out the quotes for the one or more tickers for one or more dates.
* If values is not available (for Sundays for example), some other earlier
* values **may** have been given. These values cannot be older than 7 days.
* In that case, the missing values on the original date are filled with `null`.
*
* @apiParamExample {json} Request example:
*     {
*         "tickers": "HEL:ABC",
*         "dates": "2017-07-09"
*     }
*
* @apiSuccessExample {json} Response example:
*     HTTP/1.1 200 OK
*     {
*         "2017-07-09": {
*             "ticker": "HEL:ABC",
*             "date": "2017-07-09",
*             "open": null,
*             "high": null,
*             "low": null,
*             "close": null,
*             "volume": 0
*         },
*         "2017-07-07": {
*             "ticker": "HEL:ABC",
*             "date": "2017-07-07",
*             "open": 1.66,
*             "high": 1.69,
*             "low": 1.65,
*             "close": 1.66,
*             "volume": 294064
*         }
*     }
*/
router.post('/', (req, res) => {
    const {tickers, dates} = req.body;
    let [start, end] = common.dates.closure(dates);
    d.info('Quote request for', tickers, 'for', dates.length, 'dates between', start, '-', end);
    // Adjust start so that we have backups dates for sundays.
    start = moment(start).subtract(5, 'days').format('YYYY-MM-DD');
    // Construct queries.
    let queries = [];
    tickers.forEach(ticker => {
        queries.push({ticker, start, end});
    });
    // Query them.
    Promise.all(queries.map(query => harvestCache.quotes(query.ticker, query.start, query.end)))
        .then(data => {
            let ret = {};
            let abandoned = {};
            let gaps = [];
            // Sort out the results for those asked for and those that are extra.
            for (let i = 0; i < data.length; i++) {
                for (let j = 0; j < data[i].length; j++) {
                    ret[data[i][j].ticker] = ret[data[i][j].ticker] || {};
                    if (dates.indexOf(data[i][j].date) >= 0) {
                        ret[data[i][j].ticker][data[i][j].date] = data[i][j];
                        // Now if the date does not have nothing but null, fill previous non-null.
                        if (data[i][j].close === null) {
                            gaps.push([data[i][j].ticker, data[i][j].date]);
                        }
                    } else {
                        abandoned[data[i][j].ticker] = abandoned[data[i][j].ticker] || {};
                        abandoned[data[i][j].ticker][data[i][j].date] = data[i][j];
                    }
                }
            }
            // Fill in gaps, if value can be found within 7 days earlier.
            gaps.forEach(([ticker, date]) => {
                let found = false;
                let old = moment(date);
                for (let k = 0; k < 7; k++) {
                    old.subtract(1, 'days');
                    let day = old.format('YYYY-MM-DD');
                    if (abandoned[ticker] && abandoned[ticker][day] && abandoned[ticker][day].close !== null) {
                        d.info('Providing', day, 'to fill gap for', ticker, '@', date);
                        ret[ticker] = ret[ticker] || {};
                        ret[ticker][day] = abandoned[ticker][day];
                        found = true;
                        break;
                    }
                }
                if (!found) {
                    d.warning('Could not found a replacement for missing', ticker, '@', date);
                }
            });
            res.send(ret);
        })
        .catch(err => {
            d.error('Failed:', err);
            res.status(404).send('Fetching failed.');
        });
});

/**
* @api {get} /quote/:ticker Get quotes for the ticker for 30 days.
* @apiVersion 1.0.0
* @apiName TickerQuote30
* @apiGroup Quote
* @apiParam {string} ticker Name of the ticker.
* @apiDescription
*
* Get the quotes for a single ticker for 30 days.
*
* @apiSuccessExample {json} Response example:
*     HTTP/1.1 200 OK
*     [
*         {
*             "ticker": "HEL:ABC",
*             "date": "2017-07-07",
*             "open": 1.66,
*             "high": 1.69,
*             "low": 1.65,
*             "close": 1.66,
*             "volume": 294064
*         },
*         {
*             "ticker": "HEL:ABC",
*             "date": "2017-07-08",
*             "open": null,
*             "high": null,
*             "low": null,
*             "close": null,
*             "volume": 0
*         },
*         {
*             "ticker": "HEL:ABC",
*             "date": "2017-07-09",
*             "open": null,
*             "high": null,
*             "low": null,
*             "close": null,
*             "volume": 0
*         },
*        ...
*     ]
*/
router.get('/:ticker', (req, res) => {
    const {ticker} = req.params;
    let from = moment().subtract(30,'days').format('YYYY-MM-DD');
    let to = moment().subtract(1,'days').format('YYYY-MM-DD');
    res.redirect('/quote/' + ticker + '/' + from + '/' + to);
});

module.exports = router;
