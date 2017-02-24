const express = require('express');
const quote = express.Router();
const db = require('../db');

quote.get('/', (req, res) => {
    db.select('ticker').from('tickers').then(
        data => res.send(data.map(obj => obj.ticker))
    );
});

module.exports = quote;
