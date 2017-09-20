const HarvestModule = require('./base');

class KrakenHarvetModule extends HarvestModule {

    checkRequirements() {
        return this.checkEnv('krakenApiKey', 'KRAKEN_API_KEY') && this.checkEnv('krakenApiPrivateKey', 'KRAKEN_API_PRIVATE_KEY');
    }

    getLatestFor(ticker) {
        return (ticker === 'CUR:XBT');
    }

    getLatest(ticker) {
        this.log('Getting', ticker);
        // TODO: Implement API call.
        return Promise.resolve(0.81);
    }
}

module.exports = KrakenHarvetModule;
