const express = require('express');
const config = require('../config');
const router = express.Router();
const engine = require('../engine');
const {time} = require('chronicles_of_node');

/**
 * @api {get} /latest/:code Get the latest value for an instrument.
 * @apiName QuoteData
 * @apiGroup Latest
 *
 * @apiParam {String} ticker Instrument ticker code.
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "ticker": "FOO:BAR",
 *       "value": 10.23,
 *       "currency": "EUR",
 *       "timestamp": 1506011648197
 *     }
 *
 * @apiError TickerNotFound The ticker was not found.
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 404 Not Found
 *     {
 *       "error": "TickerNotFound"
 *     }
 */
router.get('/:ticker([A-Z0-9:]+)', (req, res) => {

    const {ticker} = req.params;

    engine.getLatest(ticker)
        .then(value => res.send({ticker: ticker, value: value, currency: 'EUR', timestamp: time()}))
        .catch(err => {
            d.error(err);
            res.status(404).send({error: 'TickerNotFound'});
        });
});

module.exports = router;
