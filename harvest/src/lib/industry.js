const HarvestLookup = require('./base');

class IndustryLookup extends HarvestLookup {

    // TODO: Collect from wikipedia.
    constructor() {
        super('industry');
        this.data = {
            DEFAULT : {
                'Communications Equipment': 'Communications Equipment',
                'Investment Services': 'Investment Services',
            }
        };
    }
}

module.exports = IndustryLookup;
