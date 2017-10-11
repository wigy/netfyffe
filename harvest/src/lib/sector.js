const HarvestLookup = require('./base');

class SectorLookup extends HarvestLookup {

    constructor() {
        super('sector');
        this.names = {
            0: 'N/A',
            10: 'Energy',
            15: 'Materials',
            20: 'Industrials',
            25: 'Consumer Discretionary',
            30: 'Consumer Staples',
            35: 'Health Care',
            40: 'Financials',
            45: 'Information Technology',
            50: 'Telecommunication Services',
            60: 'Real Estate',
        };
        this.codes = this.invert(this.names);
        this.data = {
            DEFAULT : {
                'Technology': 'Technology',
                'Information Technology': 'Technology',
            }
        };
    }
}

module.exports = SectorLookup;
