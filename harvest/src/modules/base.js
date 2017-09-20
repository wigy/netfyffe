/**
 * Base class for harvest-modules.
 */
class HarvestModule {

    constructor(config, requestPromise, logger) {
        this.config = config;
        this.rp = requestPromise;
        this.log = logger;
    }

    /**
     * Hook to check environment before using this module.
     */
    checkRequirements() {
        return true;
    }

    async prepare() {
    }

    /**
     * Check if the configuration variable is set.
     * @param {string} conf Name of the configuration variable.
     * @param {string} env Name of the corresponding environmnt variable.
     */
    checkEnv(conf, env) {
        if (!this.config[conf]) {
            d.warning('Configuration needs environment', env, 'to be set.');
            return false;
        }
        return this.config[conf];
    }

    /**
     * Check if module is able to get the latest value for an instrument.
     */
    isLatestAvailable(ticker) {
        return false;
    }

    /**
     * Check if module is able to get daily data for the given range.
     */
    isDailyDataAvailable(ticker, start, end) {
        return false;
    }

    /**
     * Fetch the latest value for an ticker.
     * {ticker: "ABC:DEF", value: 1.24, currency: "EUR"}
     */
    getLatest(ticker) {
        throw new Error('Module does not implement getLatest().');
    }

    /**
     * Fetch daily closing values for date range
     * [{date: "2017-03-27", open: 1.00, close: 1.02, high: 1.05, low: 0.99, ticker: "ABC", volume: 12000}, ...]
     */
    getDailyData(ticker, start, end) {
        throw new Error('Module does not implement getDailyData().');
    }
}

module.exports = HarvestModule;
