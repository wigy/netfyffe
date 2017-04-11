const Model = require('objection').Model;
const Account = require('./Account');
const d = require('neat-dump');

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
        d.info('Applying', this.date,'transaction', '#' + this.id, this.type, this.code ? '[' + this.code + ' x ' + this.count + ']' : '[]', this.amount/100, 'to account', '#' + this.account_id);
        switch(this.type) {
            case 'deposit':
            case 'withdraw':
                return Account.deposit(this.account_id, this.date, this.amount)
                    .then(() => this.id);
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
            .then(data => Promise.all(data.map(trx => {
                return trx.apply()
                    .then(id => {
                        if (id) {
                            return Transaction
                                .query()
                                .patch({applied: true})
                                .where('id', id);
                        }
                    });
            })));
            // TODO: Unlocking needed here.
    }
}

Transaction.knex(require('../db'));

module.exports = Transaction;
