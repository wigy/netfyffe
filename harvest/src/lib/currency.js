const HarvestLookup = require('./base');

class CurrencyLookup extends HarvestLookup {

    constructor() {
        super('currency');
        this.data = {
            COUNTRY : {
                FIN: 'EUR',
                USA: 'USD',
            }
        };
    }
}

module.exports = CurrencyLookup;
