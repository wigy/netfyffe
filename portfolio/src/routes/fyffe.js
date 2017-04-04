const express = require('express');
const fyffe = express.Router();
const db = require('../db');

/**
 * @api {get} /fyffe Collect all data needed to calculate value of the portfolio.
 * @apiName AccountHistoricalValues
 * @apiGroup Portfolio
 */
fyffe.get('/', (req, res) => {
    res.send("OK");
});

module.exports = fyffe;
