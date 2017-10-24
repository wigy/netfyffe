const HarvestLookup = require('./base');

class IndustryLookup extends HarvestLookup {

    constructor() {
        super('industry');
        this.load();
        // TODO: Collect data from wikipedia.
    }
}

module.exports = IndustryLookup;
