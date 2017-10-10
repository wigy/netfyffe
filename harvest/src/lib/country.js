const HarvestLookup = require('./base');

class CountryLookup extends HarvestLookup {

    constructor() {
        super('country');
        this.data = {
            DEFAULT : {
                'Finland': 'FIN',
                'USA': 'USA',
            }
        };
    }
}

module.exports = CountryLookup;
