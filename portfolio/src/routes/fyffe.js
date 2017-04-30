const express = require('express');
const router = express.Router();
const db = require('../db');
const query = require('../lib/db/query');

/**
 * @api {get} /fyffe Collect all data needed to calculate daily values of the whole portfolio.
 * @apiName PortfolioHistoricalValues
 * @apiGroup Portfolio
 *
 * TODO: Docs.
 */
router.get('/', (req, res) => {

    query.fyffe()
        .then(results => res.send(results))
        .catch(err => {
            d.error(err);
            res.status(500).send({error: 'FetchFailed'});
        });
});

module.exports = router;
