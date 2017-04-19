const Model = require('objection').Model;
const Balance = require('./Balance');
const d = require('neat-dump');

class Account extends Model {

    static get tableName() {
        return 'accounts';
    }

    /**
     * Get the balance of the account on the given `date`.
     */
    balance(date) {
        return Balance
            .query()
            .where('account_id', this.id)
            .andWhere('date', '<=', date)
            .orderBy('date', 'desc')
            .limit(1)
            .then(res => {let ret = res.length ? res[0].balance : 0; return ret;});
    }

    /**
     * Find the account with the given ID and cache it for future.
     *
     * Returns promise resolved with the account or undefined if no such account.
     */
    static find(id) {
        let acc = Account.cache[id];
        if (acc) {
            return Promise.resolve(acc);
        }
        return Account.cacheAll()
            .then(() => {
                if (!Account.cache[id]) {
                    return Promise.reject("Cannot find account with ID " + id);
                }
                return Account.cache[id];
            });
    }

    /**
     * Delete the account and all related information.
     *
     * Returns promise, which resolves after everything is deleted.
     */
    static delete(id) {

        const Instrument = require('./Instrument');
        const Transaction = require('./Transaction');

        return Transaction
            .query()
            .where('account_id', id)
            .delete()
            .then(() => {
                return Balance
                    .query()
                    .where('account_id', id)
                    .delete()
            })
            .then(() => {
                return Instrument
                    .query()
                    .where('account_id', id)
                    .delete()
            })
            .then(() => {
                return Account
                    .query()
                    .where('id', id)
                    .delete()
            });
    }

    /**
     * Deposit an `amount` on specific `date` to the account with the given `id`.
     *
     * Returns a promise that is resolved once deposit complete.
     */
    static deposit(id, date, amount) {
        let total = amount;
        return Account.find(id)
            .then(acc => acc.balance(date))
            .then(sum => {
                // Add the cumulated balance before this.
                total += sum;
            })
            .then(() => {
                // Check if we have existing entry.
                return Balance
                    .query()
                    .where('account_id', id)
                    .andWhere('date', date);
            })
            .then(data => {
                if (data.length) {
                    // If found, update existing entry.
                    return Balance
                        .query()
                        .patch({balance: total})
                        .where('id', data[0].id)
                }
                // If not found, create new entry.
                return Balance
                    .query()
                    .insert({account_id: id, date: date, balance: total});
            })
            .then(() => {
                // Find balance entries after the date.
                return Balance
                    .query()
                    .where('account_id', id)
                    .andWhere('date', '>', date);
            })
            .then(entries => {
                // Update all entries.
                return Promise.all(entries.map(entry => {
                    return Balance
                        .query()
                        .patch({balance: entry.balance + amount})
                        .where('id', entry.id)
                }));
            })
            .then(() => true)
    }

    /**
     * Read all accounts into the cache.
     *
     * Return a promise resolved when the cache is ready.
     */
    static cacheAll() {
        Account.cache = {};
        return Account
            .query()
            .then(res => res.map(acc => {
                Account.cache[acc.id] = acc;
                return true;
            }));
    }
}

Account.knex(require('../db'));
Account.cache = {};

module.exports = Account;
