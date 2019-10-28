/**
 * Utilities for asyncronic operations.
 */

/**
 * Apply a list of functions returning promises sequentially.
 */
function seq(entries) {
    if (entries.length < 1) {
        return Promise.resolve([]);
    }
    let ret = entries[0]();
    for (let i=1; i < entries.length; i++) {
        ret = ret.then(() => entries[i]());
    }
    return ret;
}

module.exports = {seq};
// TODO: Remove this duplicate and use common.
