const Model = require('objection').Model;

class Bank extends Model {

    static get tableName() {
        return 'banks';
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
