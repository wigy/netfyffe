/**
 * Base class for harvest-modules.
 */
class HarvestModule {

    constructor(requestPromise, logger) {
        this.rp = requestPromise;
        this.log = logger;
    }

    /**
     * Check if module is able to get the latest value for an instrument.
     */
    getLatestFor(ticker) {
        return false;
    }

    /**
     * Check if module is able to get daily data for the given range.
     */
    getDailyDataFor(ticker, start, end) {
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
