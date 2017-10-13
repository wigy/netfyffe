const HarvestLookup = require('./base');

class TypeLookup extends HarvestLookup {

    constructor() {
        super('type');
        this.data = {
            DEFAULT : {
                'Equity': 'Equity',
                'ETF': 'ETF',
            }
        };
    }
}

module.exports = TypeLookup;
