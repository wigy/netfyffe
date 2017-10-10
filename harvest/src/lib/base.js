/**
 * Base class for utilities mapping various information to the Netfyffe official versions.
 */
class HarvestLookup {

    constructor(name) {
        this.name = name;
        this.data = {};
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
        if (hint && this.data[hint] && this.data[hint][text] !== undefined) {
            return this.data[hint][text];
        }
        if (this.data.DEFAULT && this.data.DEFAULT[text] !== undefined) {
            return this.data.DEFAULT[text];
        }
        d.error('Unable to identify', this.name, text, 'in the context', hint || 'DEFAULT');
        return undefined;
    }
}

module.exports = HarvestLookup;
