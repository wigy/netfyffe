/**
 * Utilities for database handling and querying.
 */
const objection = require('objection');
const Account = require('../../models/Account');
const Balance = require('../../models/Balance');
const Instrument = require('../../models/Instrument');
const Transaction = require('../../models/Transaction');

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
 * Find an instance or create one if it does not exist.
 *
 * Returns promise resolving with the instance found or created.
 */
function findOrCreate(model, members) {
    return objection.transaction(model, model => {
        return model.query()
            .where(members)
            .then(data => {
                if (data.length > 1) {
                    throw new Error("Too many matches in table '" + model.tableName + "' when looking for " + JSON.stringify(members));
                }
                if (data.length) {
                    return data[0];
                }
                return model.query().insert(members);
            });
    });
}

/**
 * Main query function to perform any query on account instruments and balances.
 *
 * See API documentation for /fyffe/ for more info.
 */
function fyffe() {

    const AccountGroup = require('../../models/AccountGroup');

    return Promise.all([
        Account.cacheAll(),
        AccountGroup.query().orderBy('id'),
        Balance.query().orderBy('date'),
        Instrument.query().orderBy('bought'),
        Transaction.query().whereIn('type', ['deposit', 'withdraw', 'cash-out', 'cash-in']).orderBy('date'),
    ]).then(all => {
        let results = {};
        results.accounts = Object.keys(all[0]).map(id => all[0][id]);
        results.account_groups = all[1];
        results.balances = {};
        all[2].forEach(bal => {
            results.balances[bal.account_id] = results.balances[bal.account_id] || {};
            results.balances[bal.account_id][bal.date] = bal.balance;
        });
        results.instruments = all[3];
        results.capital = {};
        let totals = {};
        all[4].forEach(cap => {
            results.capital[cap.account_id] = results.capital[cap.account_id] || {};
            totals[cap.account_id] = totals[cap.account_id] || 0;
            totals[cap.account_id] += cap.amount;
            results.capital[cap.account_id][cap.date] = totals[cap.account_id];
        });
        return results;
    });
}

module.exports = {insert, fyffe, findOrCreate};
