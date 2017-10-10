const HarvestLookup = require('./base');

class MarketLookup extends HarvestLookup {

    constructor() {
        super('market');
        this.data = {
            DEFAULT : {
                'NASDAQ': 'NASDAQ',
            },
            NAME : {
                'Helsinki': 'HEL',
                'BATS Europe': 'BATS',
            }
        };
    }
}

module.exports = MarketLookup;
