const Model = require('objection').Model;
const Account = require('./Account');

class Transaction extends Model {

    static get tableName() {
        return 'transactions';
    }

    /**
     * Apply the transaction, i.e. update account history accordingly.
     *
     * Returns a promise that resolves to null or transaction ID if successfully applied.
     */
    apply() {
        switch(this.type) {
            case 'deposit':
                // TODO: Implement deposit.
                return Promise.resolve(this.id);
            default:
                d.error("Don't know how to apply transaction of type", this.type, '(leaving it as is).');
                return Promise.resolve(null);
        }
    }

    /**
     * Check for all transactions that haven't been applied yet and apply them.
     *
     * Returns a promise that is resolved once all transactions have been applied.
     */
    static refresh() {
        // TODO: Locking needed here.
        return Transaction
            .query()
            .where('applied', '=', false)
            .then(data => Promise.all(data.map(trx => trx.apply())))
            // TODO: Mark successfully applied.
            // TODO: Unlocking needed here.
            .then(res => res);
    }
}

Transaction.knex(require('../db'));

module.exports = Transaction;
