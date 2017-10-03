const HarvestModule = require('./base');
const KrakenClient = require('kraken-api');

const CURRENCY_MAP = {
    BCH : 'BCH',
    DASH : 'DASH',
    XETH : 'ETH',
    XETC : 'ETC',
    XLTC : 'LTC',
    XREP : 'REP',
    XXBT : 'XBT',
    XXMR : 'XMR',
    XXRP : 'XRP',
    XZEC : 'ZEC',
};

class KrakenHarvetModule extends HarvestModule {

    constructor(config, requestPromise, logger) {
        super(config, requestPromise, logger);
        this.name = 'Kraken';
    }

    /**
     * Verify that we have API keys.
     */
    checkRequirements() {
        const key = this.checkEnv('krakenApiKey', 'KRAKEN_API_KEY');
        const priv = this.checkEnv('krakenApiPrivateKey', 'KRAKEN_API_PRIVATE_KEY');
        return key && priv;
    }

    kraken() {
        if (!this.client) {
            const key = this.checkEnv('krakenApiKey', 'KRAKEN_API_KEY');
            const priv = this.checkEnv('krakenApiPrivateKey', 'KRAKEN_API_PRIVATE_KEY');
            this.client = new KrakenClient(key, priv);
        }
        return this.client;
    }

    async query(...args) {
        this.log('API call', args);
        let kraken = this.kraken();
        return kraken.api.apply(kraken, args);
    }

    /**
     * Load the list of currencies.
     */
    async prepare() {
        this.currencyPairs = {};
        let res = await this.query('AssetPairs');
        if (res.error.length) {
            return Promise.reject('Failed:' +res.error.join(', '));
        }
        Object.keys(res.result).forEach(key => {
            if (res.result[key].quote === 'ZEUR' && key.substr(-2, 2) !== '.d') {
                const currency = CURRENCY_MAP[res.result[key].base];
                if (!currency) {
                    this.log('Don\'t know currency', res.result[key].base);
                } else {
                    let ticker = 'CUR:' + currency;
                    this.currencyPairs[ticker] = key;
                }
             }
        });
        this.log('Found valid tickers', Object.keys(this.currencyPairs));
        return Promise.resolve();
    }

    isLatestAvailable(ticker) {
        return !!this.currencyPairs[ticker];
    }

    async getLatest(ticker) {
        let kraken = this.kraken();
        let res = await this.query('Ticker', {pair : this.currencyPairs[ticker]});
        if (res.error.length) {
            return Promise.reject('Failed:' +res.error.join(', '));
        }
        return parseFloat(res.result[this.currencyPairs[ticker]].c[0]);
    }
}

module.exports = KrakenHarvetModule;
