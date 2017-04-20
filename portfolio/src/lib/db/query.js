/**
 * Utilities for database handling and querying.
 */
const Account = require('../../models/Account');
const Balance = require('../../models/Balance');
const Instrument = require('../../models/Instrument');

/**
 * Insert more than one entry to the database (Objection does not work with sqlite).
 */
function insert(model, entries) {
    if (!(entries instanceof Array)) {
        entries = [entries];
    }
    return Promise.all(entries.map(entry => model.query().insert(entry)));
}

/**
 * Main query function to perform any query on account instruments and balances.
 *
 * See API documentation for /fyffe/ for more info.
 */
function fyffe() {

    return Promise.all([
        Account.cacheAll(),
        Balance.query().orderBy('date'),
        Instrument.query()
    ]).then(all => {
        let results = {};
        results.accounts = Object.keys(all[0]).map(id => all[0][id]);
        results.balances = {};
        all[1].forEach(bal => {
            results.balances[bal.account_id] = results.balances[bal.account_id] || {};
            results.balances[bal.account_id][bal.date] = bal.balance;
        });
        results.instruments = all[2];
        return results;
    });
}

module.exports = {insert, fyffe};
