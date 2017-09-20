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

    /**
     * Load the list of currencies.
     */
    async prepare() {
        this.currencyPairs = {};
        const key = this.checkEnv('krakenApiKey', 'KRAKEN_API_KEY');
        const priv = this.checkEnv('krakenApiPrivateKey', 'KRAKEN_API_PRIVATE_KEY');
        let kraken = new KrakenClient(key, priv);
        let assets = await kraken.api('Assets');
        if (assets.error.length) {
            return Promise.reject('Failed:' +assets.error.join(', '));
        }
        Object.keys(assets.result).forEach(key => {
            if (assets.result[key].aclass === 'currency') {
                let ticker = 'CUR:' + assets.result[key].altname;
                this.currencyPairs[ticker] = key + 'EUR';
             }
        });
    }

    // TODO: Change `For` to `Available`.
    getLatestFor(ticker) {
        return !!this.currencyPairs[ticker];
    }

    getLatest(ticker) {
        this.log('Getting', ticker);
        // TODO: Implement API call.
        return Promise.resolve(0.81);
    }
}

module.exports = KrakenHarvetModule;
