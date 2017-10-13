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
                'XDUS': 'FRA',
                'XBER': 'FRA',
                'XMUN': 'FRA',
                'XSTU': 'FRA',
                'LTS': 'LON',
                'PINX': 'OTCMKTS',
            },
            NAME : {
                'Helsinki': 'HEL',
                'BATS Europe': 'BATS',
            }
        };
    }
}

module.exports = MarketLookup;
