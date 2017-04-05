const Model = require('objection').Model;
const Balance = require('./Balance');

class Account extends Model {

    static get tableName() {
        return 'accounts';
    }

    /**
     * Get the balance of the account on the day before the given `date`.
     */
    balanceBefore(date) {
        return Balance
            .query()
            .where('account_id', this.id)
            .andWhere('date', '<', date)
            .sum('balance as balance')
            .then(res => res[0].balance || 0);
    }

    /**
     * Deposit an `amount` on specific `date` to the account with the given `id`.
     */
    static deposit(id, date, amount) {
        let acc = Account.cache[id];
        if (!acc) {
            return Promise.reject("Cannot find account with ID " + id);
        }
        return acc.balanceBefore(date)
            .then(sum => {
                amount += sum;
                return Balance
                    .query()
                    .where('account_id', id)
                    .andWhere('date', date)
                    .then(data => {
                        if (data.length) {
                            return "TODO: Update " + amount;
                        }
                        return Balance
                            .query()
                            .insert({account_id: id, date: date, balance: amount});
                    });
            });
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
