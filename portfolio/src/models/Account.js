const Model = require('objection').Model;
const Balance = require('./Balance');

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
            .sum('balance as balance')
            .then(res => res[0].balance || 0);
    }

    /**
     * Deposit an `amount` on specific `date` to the account with the given `id`.
     *
     * Returns a promise that is resolved once deposit complete.
     */
    static deposit(id, date, amount) {
        let acc = Account.cache[id];
        let total = amount;
        if (!acc) {
            return Promise.reject("Cannot find account with ID " + id);
        }
        return acc.balance(date)
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
            .then(() => true);
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

module.exports = Account;
