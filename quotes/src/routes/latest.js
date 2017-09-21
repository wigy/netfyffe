const express = require('express');
const router = express.Router();
const harvestCache = require('../lib/harvest/cache');

/**
* @api {get} /latest/:ticker Get the latest value for the ticker.
* @apiVersion 1.0.0
* @apiName TickerLatest
* @apiGroup Quote
* @apiParam {string} ticker Name of the ticker.
* @apiDescription
*
* Fetch the latest known value for the ticker. Values are cached on the server
* for brief moment.
*
* @apiSuccessExample {json} Response example:
*     HTTP/1.1 200 OK
*     {
*         "ticker": "HEL:ABC",
*         "value": 124.56,
*         "currency": "EUR",
*         "timestamp": 1506011099887
*     }
*/
router.get('/:ticker', (req, res) => {
    const {ticker} = req.params;
    harvestCache.latest(ticker)
    .then(data => res.send(data))
    .catch(err => {
        d.error(err);
        res.status(500).send("Internal server error");
    });
});

module.exports = router;
