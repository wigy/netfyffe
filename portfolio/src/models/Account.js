const Model = require('objection').Model;
const query = require('../lib/db/query');
const d = require('neat-dump');

class Account extends Model {

    static get tableName() {
        return 'accounts';
    }

    /**
     * Get the balance of the account on the given `date`.
     */
    balance(date) {
        const Balance = require('./Balance');

        return Balance
            .query()
            .where('account_id', this.id)
            .andWhere('date', '<=', date)
            .orderBy('date', 'desc')
            .limit(1)
            .then(res => {let ret = res.length ? res[0].balance : 0; return ret;});
    }

    /**
     * Get the list of instruments owned on the given `date`.
     */
    instruments(date) {
        const Instrument = require('./Instrument');

        return Promise.all([
            Instrument
                .query()
                .whereNull('sold')
                .andWhere('bought', '<=', date)
                .andWhere('account_id', this.id),
            Instrument
                .query()
                .whereNotNull('sold')
                .andWhere('bought', '<=', date)
                .andWhere('sold', '>', date)
                .andWhere('account_id', this.id),
        ]).then( res => {
            return res[0].concat(res[1]);
        });
    }

    /**
     * Get the total count of instruments owned on the given `date`.
     *
     * The return value is an object with ticker codes as keys and counts per ticker as value.
     */
    instrumentsByTicker(date) {

        return this.instruments(date)
            .then(instruments => {
                let ret = {};
                instruments.forEach(inst => ret[inst.ticker] = (ret[inst.ticker] || 0) + inst.count);
                return ret;
            });
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
     * Create an account, account group and bank if needed.
     *
     * Returns a promise resolving with the account.
     */
    static findOrCreate(bank, name, code, currency) {
        const AccountGroup = require('./AccountGroup');
        const query = require('../lib/db/query');
        return AccountGroup.findOrCreate(bank, name, code)
            .then(group => query.findOrCreate(Account, {account_group_id: group.id, currency: currency}));
    }

    /**
     * Delete the account and all related information.
     *
     * Returns promise, which resolves after everything is deleted.
     */
    static delete(id) {

        const Instrument = require('./Instrument');
        const Transaction = require('./Transaction');
        const Balance = require('./Balance');

        return Transaction
            .query()
            .where('account_id', id)
            .delete()
            .then(() => {
                return Balance
                    .query()
                    .where('account_id', id)
                    .delete();
            })
            .then(() => {
                return Instrument
                    .query()
                    .where('account_id', id)
                    .delete();
            })
            .then(() => {
                return Account
                    .query()
                    .where('id', id)
                    .delete();
            });
    }

    /**
     * Deposit an `amount` on specific `date` to the account with the given `id`.
     *
     * Returns a promise that is resolved once deposit complete.
     */
    static deposit(id, date, amount) {
        const Balance = require('./Balance');

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
                        .where('id', data[0].id);
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
                        .where('id', entry.id);
                }));
            })
            .then(() => true);
    }

    /**
     * Read all accounts into the cache.
     *
     * Return a promise resolved with all accounts when loaded.
     */
    static cacheAll() {
        Account.cache = {};
        return Account
            .query()
            .then(res => {
                res.map(acc => Account.cache[acc.id] = acc);
                return Account.cache;
            });
    }
}

Account.knex(require('../db'));
Account.cache = {};

module.exports = Account;
