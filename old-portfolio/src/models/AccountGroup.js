const Model = require('objection').Model;
const query = require('../lib/db/query');

class AccountGroup extends Model {

    static get tableName() {
        return 'account_groups';
    }

    /**
     * Create an account group and bank if needed.
     *
     * Returns a promise resolving with the account group.
     */
    static findOrCreate(bank, name, code) {
        const Bank = require('./Bank');
        return Bank.findOrCreate(bank)
            .then(bank => query.findOrCreate(AccountGroup, {bank_id: bank.id, name: name, code: code}));
    }

    /**
     * Delete the account group and all related information.
     *
     * Returns promise, which resolves after everything is deleted.
     */
    static delete(id) {
        const Account = require('./Account');

        return Account
            .query()
            .where('account_group_id', id)
            .then(data => {
                return Promise.all(data.map(account => Account.delete(account.id)));
            })
            .then(() => {
                return AccountGroup
                    .query()
                    .where('id', id)
                    .delete();
            });
    }
}

AccountGroup.knex(require('../db'));

module.exports = AccountGroup;
