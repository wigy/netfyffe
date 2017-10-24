const HarvestLookup = require('./base');

class MarketLookup extends HarvestLookup {

    constructor() {
        super('market');
        this.load();
    }
}

module.exports = MarketLookup;
