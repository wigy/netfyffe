const HarvestLookup = require('./base');

/**
 * ISO 10383 market codes.
 */
class MarketLookup extends HarvestLookup {

    constructor() {
        super('market');
        this.load();
    }
}

module.exports = MarketLookup;
