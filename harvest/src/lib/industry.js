const HarvestLookup = require('./base');

class IndustryLookup extends HarvestLookup {

    constructor() {
        super('industry');
        this.data = {
            DEFAULT : {
                'Communications Equipment': 'Communications Equipment',
            }
        };
    }
}

module.exports = IndustryLookup;
