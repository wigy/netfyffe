const express = require('express');
const fyffe = express.Router();
const db = require('../db');
const Transaction = require('../models/Transaction');

/**
 * @api {get} /fyffe Collect all data needed to calculate value of the portfolio.
 * @apiName AccountHistoricalValues
 * @apiGroup Portfolio
 *
 * TODO: Docs.
 */
fyffe.get('/', (req, res) => {
    // TODO: Fetch all accounts into the cache.
    Transaction.refresh()
        .then(res => d("Resolved:", res))
    res.send("TODO");
});

module.exports = fyffe;
