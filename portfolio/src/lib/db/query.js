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
    return Promise.all(entries.map(entry => model.query().insert(entry)));
}

module.exports = {insert};
