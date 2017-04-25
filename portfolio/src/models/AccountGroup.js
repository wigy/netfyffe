const Model = require('objection').Model;

class AccountGroup extends Model {

    static get tableName() {
        return 'account_groups';
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
