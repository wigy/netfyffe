const express = require('express');
const quote = express.Router();
const harvestCache = require('../lib/harvest/cache');
const db = require('../db');

// TODO: API docs.
quote.get('/', (req, res) => {
    db.select('ticker').from('tickers').then(
        data => res.send(data.map(obj => obj.ticker))
    );
});

quote.get('/:ticker', (req, res) => {
    // TODO: Ask from harvester (configured start date until yesterday).
    res.send("TODO");
});

quote.get('/:ticker([A-Z0-9:]+)/:start(\\d{4}-\\d{2}-\\d{2})/:end(\\d{4}-\\d{2}-\\d{2})', (req, res) => {
    const {ticker, start, end} = req.params;
    harvestCache.quotes(ticker, start, end)
        .then(data => res.send(data))
        .catch(err => {
            d.error(err);
            res.status(500).send("Internal server error");
        });
});

module.exports = quote;
