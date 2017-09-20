const HarvestModule = require('./base');

class KrakenHarvetModule extends HarvestModule {

    // TODO: Implement checking and validation for proper ENVs and drop with warning this module if not fulfilled.
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
