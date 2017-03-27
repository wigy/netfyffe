const express = require('express');
const quote = express.Router();
const db = require('../db');

// TODO: API docs.
quote.get('/', (req, res) => {
    db.select('ticker').from('tickers').then(
        data => res.send(data.map(obj => obj.ticker))
    );
});

quote.get('/:ticker', (req, res) => {
    // TODO: Ask from harvester.
    res.send("TODO");
});

quote.get('/:ticker/:from/:to', (req, res) => {
    // TODO: Check for existing data.
    // TODO: Add mocha tests using mocked harvester.
    // TODO: Move fetching and logic to the separate service module that uses memory cache.
    // TODO: Use harvesting using configured url.
    res.send("TODO");
});

module.exports = quote;
