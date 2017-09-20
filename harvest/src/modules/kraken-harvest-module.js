const HarvestModule = require('./base');
const KrakenClient = require('kraken-api');

class KrakenHarvetModule extends HarvestModule {

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
        let res = await this.query('Assets');
        if (res.error.length) {
            return Promise.reject('Failed:' +res.error.join(', '));
        }
        Object.keys(res.result).forEach(key => {
            if (res.result[key].aclass === 'currency') {
                let ticker = 'CUR:' + res.result[key].altname;
                // TODO: Actually not all pairs work. Check functional pairs from AssetPairs API.
                this.currencyPairs[ticker] = key + 'ZEUR';
             }
        });
    }

    // TODO: Change `For` to `Available`.
    getLatestFor(ticker) {
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
