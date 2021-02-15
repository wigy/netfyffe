const express = require('express');
const moment = require('moment');
const engine = require('../engine');

const router = express.Router();

/**
* @api {GET} /ticker/:ticker Get quotes for the ticker for 30 days.
* @apiVersion 1.0.0
* @apiName TradingPair
* @apiGroup Ticker
* @apiParam {string} exchange Name of the exchange.
* @apiParam {string} sell Instrument ticket to sell.
* @apiParam {string} buy Instrument ticket to buy.
* @apiParam {string} date Date and time.
* @apiDescription
*
* Get the trading pair value at the given time stamp.
*/
router.get('/:exchange/:sell/:buy/:date', (req, res) => {
  const {exchange, sell, buy, date} = req.params;
  engine.getPair(exchange, sell, buy, date)
    .then(data => res.send(data))
    .catch(err => {
      d.error(err);
      res.status(404).send({"error": "NotFound"});
  });
});

module.exports = router;
