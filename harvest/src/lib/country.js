const HarvestLookup = require('./base');

class CountryLookup extends HarvestLookup {

    constructor() {
        super('country');
        this.data = {
            DEFAULT : {
                'Finland': 'FI',
                'USA': 'US',
                'Denmark': 'DK',
                'UK': 'UK',
                'Sweden': 'SE',
                'Switzerland': 'CH',
            }
        };
    }
}

module.exports = CountryLookup;
