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
          const exchange = name.toUpperCase();
          this.exchanges[exchange] = this.exchanges[exchange] || {name, trades: {}, euro: new Set(), usd: new Set(), btc: new Set()};
          this.exchanges[exchange].trades[coin] = new Set(trades);
          if (this.exchanges[exchange].trades[coin].has('EUR')) {
            this.exchanges[exchange].euro.add(coin);
          }
          if (this.exchanges[exchange].trades[coin].has('USD')) {
            this.exchanges[exchange].usd.add(coin);
          }
          if (this.exchanges[exchange].trades[coin].has('BTC')) {
            this.exchanges[exchange].btc.add(coin);
          }
        })
      });
    }

    ex(exchange) {
      exchange = exchange.toUpperCase();
      switch(exchange) {
        case 'GDAX':
          return 'COINBASE';
      }
      return exchange;
    }

    isLatestAvailable(ticker) {
      let [exchange, coin] = ticker.split(':');
      exchange = this.ex(exchange);
      return this.exchanges[exchange] && this.exchanges[exchange].euro && this.exchanges[exchange].euro.has(coin);
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

    isSpotPriceAvailable(ticker, stamp) {
      return this.isLatestAvailable(ticker);
    }

    async getSpotPrice(ticker, stamp) {
      let [exchange, coin] = ticker.split(':');
      exchange = this.ex(exchange);
      const price = await cc.priceHistorical(coin, 'EUR', new Date(stamp), {exchanges: [this.exchanges[exchange].name]});
      return {
        ticker: ticker,
        time: moment.utc(stamp).format('YYYY-MM-DD HH:mm:ss'),
        price: price.EUR,
      };
  }

    isPairAvailable(exchange, sell, buy, stamp) {
      exchange = this.ex(exchange);
      return this.exchanges[exchange] && this.exchanges[exchange].trades[sell] && this.exchanges[exchange].trades[sell].has(buy);
    }

    async getPair(exchange, sell, buy, stamp) {
      exchange = this.ex(exchange);
      const date = new Date(stamp);
      const price = await cc.priceHistorical(sell, buy, date, {exchanges: [this.exchanges[exchange].name]});
      return {
        exchange,
        sell,
        buy,
        price: price[buy],
        date: moment(date).format('YYYY-MM-DD HH:mm:ss')
      };
    }
}

module.exports = CryptoCompareHarvestModule;
