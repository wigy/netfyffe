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
      this.apikey = process.env['EXCHANGERATES_APIKEY'];
      if (!this.apikey) {
        throw new Error('EXCHANGERATES_APIKEY not set.');
      }
      const data = await fetch(`http://api.currencylayer.com/live?access_key=${this.apikey}`);
      const json = await data.json();
      if (json.error) {
        throw new Error(`Fetch failed: ${JSON.stringify(json)}`);
      }
      this.currencies = new Set(Object.keys(json.quotes).map(c => c.substr(3, 3)));
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
      const data = await this.get(`http://api.currencylayer.com/live?currencies=EUR,${currency}&access_key=${this.apikey}`, null, {json: true});
      if (data.error) {
        throw new Error(`Fetch failed: ${JSON.stringify(data)}`);
      }
      const usdeur = data.quotes.USDEUR;
      const conv = data.quotes[`USD${currency}`];
      return (1 / conv) * usdeur;
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

      const ret = [];
      for(let s = moment(first), e = moment(last); s.diff(e) <= 0; s.add(1,'day')) {
        const date = s.format('YYYY-MM-DD');
        const data = await this.get(`http://api.currencylayer.com/historical?date=${date}&currencies=EUR,${currency}&access_key=${this.apikey}`, `${currency}.${date}.json`)
        if (!data.success) {
          throw new Error(`API access to api.currencylayer.com failed: ${JSON.stringify(data)}`)
        }
        const usdeur = data.quotes.USDEUR;
        const conv = data.quotes[`USD${currency}`];
        const rate = (1 / conv) * usdeur;
        ret.push({
          ticker,
          date,
          close: rate,
          open: null,
          high: null,
          low: null,
          volume: null
        });
      }
      return ret;
    }
}

module.exports = ExchangeRatesApiHarvestModule;
