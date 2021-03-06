const HarvestLookup = require('./base');

class TickerLookup extends HarvestLookup {

    constructor() {
        super('ticker');
        this.options.autoInsertMissingWords = false;
        this.options.errorForMissingWords = false;
        this.load();
    }
}

module.exports = TickerLookup;
