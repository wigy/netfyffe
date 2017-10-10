const HarvestLookup = require('./base');

class AssetClassLookup extends HarvestLookup {

    constructor() {
        super('asset class');
        this.data = {
            DEFAULT : {
                'N/A': 'N/A',
                'Equity': 'Equity',
                'Fixed Income': 'Fixed Income',
                'Real Estate': 'Real Estate',
            },
            TYPE: {
                'ETF': null,
            }
        };
    }
}

module.exports = AssetClassLookup;
