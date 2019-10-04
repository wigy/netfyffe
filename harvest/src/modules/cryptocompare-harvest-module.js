const cc = require('cryptocompare');
const moment = require('moment');
const HarvestModule = require('./base');
global.fetch = require('node-fetch');

class CryptoCompareHarvestModule extends HarvestModule {

    constructor(config, requestPromise, logger) {
        super(config, requestPromise, logger);
        this.name = 'CryptoCompare';
        this.exchanges = {};
    }

    async prepare() {
      const exchanges = await cc.exchangeList();
      Object.entries(exchanges).forEach(([name, coins]) => {
        Object.entries(coins).forEach(([coin, trades]) => {
          if (trades.includes('EUR')) {
            const exchange = name.toUpperCase();
            this.exchanges[exchange] = this.exchanges[exchange] || {name, trades: []};
            this.exchanges[exchange].trades.push(coin);
          }
        })
      });
    }

    ex(exchange) {
      switch(exchange) {
        case 'GDAX':
          return 'COINBASE';
      }
      return exchange;
    }

    isLatestAvailable(ticker) {
      let [exchange, coin] = ticker.split(':');
      exchange = this.ex(exchange);
      return this.exchanges[exchange] && this.exchanges[exchange].trades.includes(coin);
    }

    async getLatest(ticker) {
      let [exchange, coin] = ticker.split(':');
      exchange = this.ex(exchange);
      const price = await cc.price(coin, 'EUR', {exchanges: [this.exchanges[exchange].name]});
      return price.EUR;
    }

    isDailyDataAvailable(ticker, start, end) {
      return this.isLatestAvailable(ticker);
    }

    async getDailyData(ticker, first, last) {
      let [exchange, coin] = ticker.split(':');
      exchange = this.ex(exchange);
      let dates = [];
      let ret = [];
      for (const date = moment(first); date.format('YYYY-MM-DD') <= last; date.add(1, 'day')) {
        dates.push(date.format('YYYY-MM-DD 23:59:59'));
      }
      for (const time of dates) {
        const price = await cc.priceHistorical(coin, 'EUR', new Date(time), {exchanges: [this.exchanges[exchange].name]});
        ret.push({
          ticker: ticker,
          open: null,
          low: null,
          high: null,
          volume: null,
          close: price.EUR,
          date: time.substr(0, 10)
        });
      }
      return ret;
    }
}

module.exports = CryptoCompareHarvestModule;
