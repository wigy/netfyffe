const HarvestLookup = require('./base');

class CountryLookup extends HarvestLookup {

    constructor() {
        super('country');
        this.load();
    }
}

module.exports = CountryLookup;
