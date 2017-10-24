const HarvestLookup = require('./base');

class TypeLookup extends HarvestLookup {

    constructor() {
        super('type');
        this.load();
    }
}

module.exports = TypeLookup;
