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
    // TODO: Tricker harvesting and respond with 'unknown'.
    res.send("TODO");
});

module.exports = quote;
