const HarvestLookup = require('./base');

class ProviderLookup extends HarvestLookup {

    constructor() {
        super('provider');
        this.patterns = {
            DEFAULT : {
                'Global X': /^Global X/,
                'iShares': /^iShares/,
            }
        };
    }
}

module.exports = ProviderLookup;
