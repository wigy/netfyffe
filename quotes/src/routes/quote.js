const express = require('express');
const moment = require('moment');
const router = express.Router();
const harvestCache = require('../lib/harvest/cache');
const db = require('../db');

// TODO: API docs.
router.get('/', (req, res) => {
    db.select('ticker').from('tickers').then(
        data => res.send(data.map(obj => obj.ticker))
    );
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
