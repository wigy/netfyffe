const express = require('express');
const fyffe = express.Router();
const db = require('../db');
const Account = require('../models/Account');
const Transaction = require('../models/Transaction');

/**
 * @api {get} /fyffe Collect all data needed to calculate value of the portfolio.
 * @apiName AccountHistoricalValues
 * @apiGroup Portfolio
 *
 * TODO: Docs.
 */
fyffe.get('/', (req, res) => {
    Account.cacheAll()
        .then(() => {
            // TODO: Drop this. Not needed here.
            Transaction.refresh()
                // TODO: Collect actual data from accounts, once transactions applied.
                .then(data => res.send(data))
        })
        .catch(err => {
            d.error(err);
            res.status(500).send({error: 'FetchFailed'});
        });
});

module.exports = fyffe;
