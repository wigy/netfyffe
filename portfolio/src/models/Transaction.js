const Model = require('objection').Model;
const Account = require('./Account');
const promise = require('../lib/async/promise');
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

        function implementation(self) {
            switch(self.type) {
                case 'deposit':
                case 'withdraw':
                    return Account.deposit(self.account_id, self.date, self.amount);
                default:
                    d.error("Don't know how to apply transaction of type", self.type, '(leaving it as is).');
                    return Promise.resolve(null);
            }
        }

        return Transaction
            .query()
            .patch({applied: true})
            .where('id', this.id)
            .then(() => implementation(this))
            .then(res => res)
            .catch(err => {
                d.error("Transaction failed", err);
                return Transaction
                    .query()
                    .patch({applied: false})
                    .where('id', this.id);
            });
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
            .then(data => {
                data = data.map(trx => (() => trx.apply()));
                return promise.seq(data);
            });
            // TODO: Unlocking needed here.
    }
}

Transaction.knex(require('../db'));

module.exports = Transaction;
