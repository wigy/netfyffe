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
      return exchange === 'CURRENCY' && (this.currencies.has(currency) || currency === 'EUR');
    }

    async getLatest(ticker) {
      const [, currency] = ticker.split(':');
      if (currency === 'EUR') {
        return 1.0;
      }
      const data = await this.get(`https://api.exchangeratesapi.io/latest?base=EUR&symbols=${currency}`, null, {json: true});
      return 1 / data.rates[currency];
    }

    isDailyDataAvailable(ticker, start, end) {
      return this.isLatestAvailable(ticker);
    }

    async getDailyData(ticker, first, last) {
      const [, currency] = ticker.split(':');
      if (currency === 'EUR') {
        const ret = [];
        for(let s = moment(first), e = moment(last); s.diff(e) <= 0; s.add(1,'day')) {
          const date = s.format('YYYY-MM-DD');
          ret.push({
            ticker: 'CURRENCY:EUR',
            date,
            close: 1,
            open: 1,
            high: 1,
            low: 1,
            volume: null
          });
        }
        return ret;
      }
      const data = await this.get(`https://api.exchangeratesapi.io/history?start_at=${first}&end_at=${last}&symbols=${currency}`, `${currency}.${first}.${last}.json`)
      return Object.entries(data.rates).map(([date, rate]) => ({
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
