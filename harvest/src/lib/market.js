const HarvestLookup = require('./base');

class MarketLookup extends HarvestLookup {

    constructor() {
        super('market');
        this.data = {
            DEFAULT : {
                'NASDAQ': 'NASDAQ',
                'XNAS': 'NASDAQ',
                'XNYS': 'NYSE',
                'XFRA': 'FRA',
                'LTS': 'LON',
            },
            NAME : {
                'Helsinki': 'HEL',
                'BATS Europe': 'BATS',
            }
        };
    }
}

module.exports = MarketLookup;
