const express = require('express');
const moment = require('moment');
const storage = require('../storage');

const router = express.Router();

/**
 * @api {GET} /ticker/:code/:start/:end Collect daily data for an instrument.
 * @apiName QuoteData
 * @apiGroup Ticker
 *
 * @apiParam {String} ticker Instrument ticker code.
 * @apiParam {String} start First date of the range as YYYY-MM-DD.
 * @apiParam {String} end Last date of the range as YYYY-MM-DD.
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     [{
 *       "ticker": "FOO:BAR",
 *       "date": "2017-01-03",
 *       "open": 10.01
 *       "close": 10.23
 *       "low": 9.97
 *       "high": 10.12
 *       "volume": 12900
 *     }, {
 *       "ticker": "FOO:BAR",
 *       "date": "2017-01-04",
 *       "open": 10.23
 *       "close": 10.36
 *       "low": 10.11
 *       "high": 10.44
 *       "volume": 1500
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
router.get('/:ticker([-A-Z0-9:]+)/:start(\\d{4}-\\d{2}-\\d{2})/:end(\\d{4}-\\d{2}-\\d{2})', (req, res) => {

  const { ticker, start, end } = req.params;

  storage.getDailyData(ticker, start, end)
    .then(data => res.send(data))
    .catch(err => {
      d.error(err);
      res.status(404).send({"error": "TickerNotFound"});
    });
});

module.exports = router;
