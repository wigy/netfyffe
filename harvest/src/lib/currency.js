const HarvestLookup = require('./base');

class CurrencyLookup extends HarvestLookup {

    constructor() {
        super('currency');
        this.load();
    }
}

module.exports = CurrencyLookup;
