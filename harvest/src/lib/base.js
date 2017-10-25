const fs = require('fs');

/**
 * Base class for utilities mapping various information to the Netfyffe official versions.
 */
class HarvestLookup {

    constructor(name) {
        this.name = name;
        this.data = null;
        this.codes = {};
        this.patterns = {};
        this.options = {
            autoInsertMissingWords: true,
            errorForMissingWords: true,
        };
    }

    get path() {
        return __dirname + '/data/' + this.name + '.json';
    }

    /**
     * Load data from `.json` file.
     */
    load() {
        this.data = require(this.path);
    }

    /**
     * Save the text placholder (or with result) to the database.
     */
    save(text, hint, result = null) {
        if (result === null) {
            if (!this.data) {
                return;
            }
            if (this.data[hint] && this.data[hint][text] === null) {
                return;
            }
        }
        this.data = this.data || {};
        this.data[hint] = this.data[hint] || {};
        this.data[hint][text] = result;
        const str = JSON.stringify(this.data, null, 4);
        d.warning('File changed, saving', this.path);
        fs.writeFileSync(this.path, str);
    }

    /**
     * Helper to transform index to value mapping into value to index mapping.
     * @param {Object} map
     */
    invert(map) {
        let ret = {};
        Object.keys(map).forEach(key => {ret[map[key]] = key;});
        return ret;
    }
    /**
     * Try to find official name used in Netfyffe for the given term.
     * @param {String} text Text to find a match.
     * @param {String} [hint] Additional context hint - usually some kind of code specifying source data type.
     */
    find(text, hint) {
        if (hint && this.data && this.data[hint] && this.data[hint][text] !== undefined && this.data[hint][text] !== null) {
            return this.data[hint][text];
        }
        if (this.data && this.data.DEFAULT && this.data.DEFAULT[text] !== undefined && this.data.DEFAULT[text] !== null) {
            return this.data.DEFAULT[text];
        }
        if (this.patterns.DEFAULT) {
            let ret = null;
            Object.keys(this.patterns.DEFAULT).forEach(key => {
                if (this.patterns.DEFAULT[key].test(text)) {
                    ret = key;
                    return;
                }
            });
            if (ret) {
                return ret;
            }
        }
        if (this.options.errorForMissingWords) {
            d.error('Unable to identify', this.name, text, 'in the context', hint || 'DEFAULT');
        }
        if (this.options.autoInsertMissingWords) {
            this.save(text, hint || 'DEFAULT');
        }
        return undefined;
    }
}

module.exports = HarvestLookup;
