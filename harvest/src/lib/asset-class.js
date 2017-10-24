const HarvestLookup = require('./base');

class AssetClassLookup extends HarvestLookup {

    constructor() {
        super('asset-class');
        this.load();
    }
}

module.exports = AssetClassLookup;
