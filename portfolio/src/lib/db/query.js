/**
 * Utilities for database handling with objection.
 */

/**
 * Insert more than one entry to the database (Objection does not work with sqlite).
 */
function insert(model, entries) {
    if (!(entries instanceof Array)) {
        entries = [entries];
    }
    if (entries.length < 1) {
        return Promise.resolve([]);
    }
    let ret = model.query().insert(entries[0]);
    for (let i=1; i < entries.length; i++) {
        ret = ret.then(() => model.query().insert(entries[i]));
    }
    return ret;
}

module.exports = {insert};
