const Model = require('objection').Model;
const promise = require('../lib/async/promise');
const lockfile = require('lockfile');
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
        const Account = require('./Account');
        const Instrument = require('./Instrument');

        d.info('Applying', this.date,'transaction', '#' + this.id, this.type, this.code ? '[' + this.code + ' x ' + this.count + ']' : '[]', this.amount/100, 'to account', '#' + this.account_id);

        function implementation(self) {
            switch(self.type) {
                case 'buy':
                    return Instrument.buy(self.account_id, self.date, -self.amount, self.count, self.code)
                        .then(() => Account.deposit(self.account_id, self.date, self.amount));

                case 'sell':
                    return Instrument.sell(self.account_id, self.date, self.amount, self.count, self.code)
                        .then(() => Account.deposit(self.account_id, self.date, self.amount));

                case 'out':
                    return Instrument.moveOut(self.account_id, self.date, self.count, self.code);

                case 'in':
                    return Promise.reject("Unimplemented");

                case 'cancel':
                    return Instrument.cancelMoveOut(self.account_id, self.date, self.count, self.code);

                case 'deposit':
                case 'withdraw':
                case 'cash-in':
                case 'cash-out':
                case 'cash-cancel':
                case 'interest':
                case 'tax':
                case 'divident':
                case 'expense':
                    return Account.deposit(self.account_id, self.date, self.amount);
                default:
                    return Promise.reject("Don't know how to apply transaction of type '" + self.type + "' (leaving it as is).");
            }
        }

        return Transaction
            .query()
            .patch({applied: true})
            .where('id', this.id)
            .then(() => implementation(this))
            .then(res => res)
            .catch(err => {
                d.error("Transaction failed:", err);
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
        lockfile.lockSync('.transaction.lock');
        return Transaction
            .query()
            .where('applied', '=', false)
            .orderBy('date')
            .orderBy('id')
            .then(data => {
                data = data.map(trx => (() => trx.apply()));
                return promise.seq(data);
            })
            .finally(() => lockfile.unlockSync('.transaction.lock'))
    }
}

Transaction.knex(require('../db'));

module.exports = Transaction;
