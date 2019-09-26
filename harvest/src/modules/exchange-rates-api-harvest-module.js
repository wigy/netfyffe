const moment = require('moment');
const HarvestModule = require('./base');
global.fetch = require('node-fetch');

class ExchangeRatesApiHarvestModule extends HarvestModule {

    constructor(config, requestPromise, logger) {
        super(config, requestPromise, logger);
        this.name = 'ExchangeRatesApi';
        this.currencies = new Set();
    }

    async prepare() {
      const data = await fetch('https://api.exchangeratesapi.io/latest');
      this.currencies = new Set(Object.keys((await data.json()).rates));
    }

    isLatestAvailable(ticker) {
      const [exchange, currency] = ticker.split(':');
      return exchange === 'CURRENCY' && this.currencies.has(currency);
    }

    async getLatest(ticker) {
      const [exchange, currency] = ticker.split(':');
      const data = await fetch(`https://api.exchangeratesapi.io/latest?base=EUR&symbols=${currency}`);
      const json = await data.json();
      return 1 / json.rates[currency];
    }

    isDailyDataAvailable(ticker, start, end) {
      return this.isLatestAvailable(ticker);
    }

    async getDailyData(ticker, first, last) {
      const [exchange, currency] = ticker.split(':');
      const data = await fetch(`https://api.exchangeratesapi.io/history?start_at=${first}&end_at=${last}&symbols=${currency}`);
      const json = await data.json();
      return Object.entries(json.rates).map(([date, rate]) => ({
        ticker,
        date,
        close: 1 / rate[currency],
        open: null,
        high: null,
        low: null,
        volume: null
      })).sort((a, b) => (a.date < b.date ? -1 : (a.date > b.date ? 1 : 0)));
    }
}

module.exports = ExchangeRatesApiHarvestModule;