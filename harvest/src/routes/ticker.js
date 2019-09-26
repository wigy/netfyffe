const express = require('express');
const moment = require('moment');
const storage = require('../storage');
const db = require('../db');

const router = express.Router();

/**
 * @api {GET} /ticker/:code/:start/:end Collect daily data for an instrument.
 * @apiName TickerQuote
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

/**
 * @api {GET} /ticker/:code/:date Get data for one day for an instrument.
 * @apiName TickerQuoteSingle
 * @apiGroup Ticker
 *
 * @apiParam {String} ticker Instrument ticker code.
 * @apiParam {String} date Date as YYYY-MM-DD.
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "ticker": "FOO:BAR",
 *       "date": "2017-01-03",
 *       "open": 10.01
 *       "close": 10.23
 *       "low": 9.97
 *       "high": 10.12
 *       "volume": 12900
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
router.get('/:ticker([-A-Z0-9:]+)/:date(\\d{4}-\\d{2}-\\d{2})', (req, res) => {

  const { ticker, date } = req.params;

  storage.getDailyData(ticker, date, date)
    .then(data => res.send(data[0]))
    .catch(err => {
      d.error(err);
      res.status(404).send({"error": "TickerNotFound"});
    });
});

/**
* @api {GET} /ticker/:ticker Get quotes for the ticker for 30 days.
* @apiVersion 1.0.0
* @apiName TickerQuote30
* @apiGroup Ticker
* @apiParam {string} ticker Name of the ticker.
* @apiDescription
*
* Get the quotes for a single ticker for 30 days.
*
* @apiSuccessExample {json} Response example:
*     HTTP/1.1 200 OK
*     [
*         {
*             "ticker": "HEL:ABC",
*             "date": "2017-07-07",
*             "open": 1.66,
*             "high": 1.69,
*             "low": 1.65,
*             "close": 1.66,
*             "volume": 294064
*         },
*         {
*             "ticker": "HEL:ABC",
*             "date": "2017-07-08",
*             "open": null,
*             "high": null,
*             "low": null,
*             "close": null,
*             "volume": 0
*         },
*         {
*             "ticker": "HEL:ABC",
*             "date": "2017-07-09",
*             "open": null,
*             "high": null,
*             "low": null,
*             "close": null,
*             "volume": 0
*         },
*        ...
*     ]
*/
router.get('/:ticker', (req, res) => {
  const {ticker} = req.params;
  let from = moment().subtract(30,'days').format('YYYY-MM-DD');
  let to = moment().subtract(1,'days').format('YYYY-MM-DD');
  storage.getDailyData(ticker, from, to)
    .then(data => res.send(data))
    .catch(err => {
      d.error(err);
      res.status(404).send({"error": "TickerNotFound"});
    });
});

/**
* @api {GET} /quote Get the list of ticker names.
* @apiVersion 1.0.0
* @apiName TickerList
* @apiGroup Ticker
* @apiDescription
*
* Lists all known tickers in the database.
*
* @apiSuccessExample {json} Response example:
*     HTTP/1.1 200 OK
*     [
*        "HEL:ABC",
*        "HEL:DEF",
*        "FRA:ABC",
*        ...
*     ]
*/
router.get('/', async (req, res) => {
  const data = await db.select('ticker').from('quotes').groupBy('ticker').pluck('ticker');
  res.send(data)
});

module.exports = router;
