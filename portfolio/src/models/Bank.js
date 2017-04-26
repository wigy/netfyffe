const Model = require('objection').Model;
const query = require('../lib/db/query');

class Bank extends Model {

    static get tableName() {
        return 'banks';
    }

    /**
     * Create a bank if needed.
     *
     * Returns a promise resolving with bank.
     */
    static findOrCreate(bank) {
        return query.findOrCreate(Bank, {name: bank});
    }

    /**
     * Delete the bank and all related information.
     *
     * Returns promise, which resolves after everything is deleted.
     */
    static delete(id) {

        const AccountGroup = require('./AccountGroup');

        return AccountGroup
            .query()
            .where('bank_id', id)
            .then(data => {
                return Promise.all(data.map(accgroup => AccountGroup.delete(accgroup.id)));
            })
            .then(() => {
                return Bank
                    .query()
                    .where('id', id)
                    .delete();
            });
    }
}

Bank.knex(require('../db'));

module.exports = Bank;
