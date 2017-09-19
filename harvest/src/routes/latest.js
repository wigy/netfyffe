const express = require('express');
const config = require('../config');
const router = express.Router();
const engine = require('../engine');

/**
 * @api {get} /latest/:code Get the latest value for an instrument.
 * @apiName QuoteData
 * @apiGroup Latest
 *
 * @apiParam {String} ticker Instrument ticker code.
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     [{
 *       "ticker": "FOO:BAR",
 *       "value": 10.23,
 *       "currency": "EUR"
 *     }]
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
    const value = 0.1;

    engine.getLatest(ticker)
        .then(value => res.send([{ticker: ticker, value: value, currency: 'EUR'}]))
        .catch(err => {
            d.error(err);
            res.status(404).send('Not Found');
        });
});

module.exports = router;
