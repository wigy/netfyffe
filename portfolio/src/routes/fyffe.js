const express = require('express');
const router = express.Router();
const db = require('../db');
const query = require('../lib/db/query');

/**
 * @api {get} /fyffe Collect all data needed to calculate daily values of the whole portfolio.
 * @apiName PortfolioFullData
 * @apiGroup Portfolio
 * @apiDescription
 *
 * Collect all information of the portfolio.
 *
 * @apiSuccessExample Success-Response:
 * {
 *     "accounts": [
 *         {
 *             "id": 1,
 *             "account_group_id": 1,
 *             "currency": "EUR"
 *         }
 *     ],
 *     "account_groups": [
 *         {
 *             "id": 1,
 *             "bank_id": 1,
 *             "name": "Euro Account",
 *             "code": "12345"
 *         }
 *     ],
 *     "balances": {
 *         "1": {
 *             "2016-08-01": 200000,
 *             "2016-08-03": 149800,
 *             "2016-09-14": 48836,
 *             "2017-03-24": 126781
 *         }
 *     },
 *     "instruments": [
 *         {
 *             "id": 1,
 *             "account_id": 1,
 *             "ticker": "HEL:NOKIA",
 *             "count": 100,
 *             "buy_price": 50200,
 *             "sell_price": null,
 *             "bought": "2016-08-03",
 *             "sold": null
 *         }
 *     ],
 *     "capital": {
 *         "1": {
 *             "2016-08-01": 200000
 *         }
 *     }
 * }
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
