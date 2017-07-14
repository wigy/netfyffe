const express = require('express');
const moment = require('moment');
const router = express.Router();
const harvestCache = require('../lib/harvest/cache');
const db = require('../db');
const common = require('../../../common');

// TODO: API docs.
router.get('/', (req, res) => {
    db.select('ticker').from('tickers').then(
        data => res.send(data.map(obj => obj.ticker))
    );
});

// TODO: API docs.
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

router.get('/:ticker', (req, res) => {
    const {ticker} = req.params;
    let from = moment().subtract(30,'days').format('YYYY-MM-DD');
    let to = moment().subtract(1,'days').format('YYYY-MM-DD');
    res.redirect('/quote/' + ticker + '/' + from + '/' + to);
});

router.get('/:ticker([A-Z0-9:]+)/:start(\\d{4}-\\d{2}-\\d{2})/:end(\\d{4}-\\d{2}-\\d{2})', (req, res) => {
    const {ticker, start, end} = req.params;
    harvestCache.quotes(ticker, start, end)
        .then(data => res.send(data))
        .catch(err => {
            d.error(err);
            res.status(500).send("Internal server error");
        });
});

module.exports = router;
