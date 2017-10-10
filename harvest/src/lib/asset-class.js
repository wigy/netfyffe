const HarvestLookup = require('./base');

class AssetClassLookup extends HarvestLookup {

    constructor() {
        super('asset class');
        this.data = {
            DEFAULT : {
                'Equity': 'Equity'
            },
            TYPE: {
                'ETF': null,
            }
        };
    }
}

module.exports = AssetClassLookup;
