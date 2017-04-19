const Account = require('./Account');
const Transaction = require('./Transaction');
const Balance = require('./Balance');
const query = require('../lib/db/query');

describe('Transaction', function() {

    before(function(done) {
        query.insert(Account, {id: 1, name: 'Test account', bank: 'Test Bank', code: 'ACC001', currency: 'EUR'})
            .then(() => query.insert(Transaction, [
                {account_id: 1, date: '2017-01-01', 'type': 'deposit', amount: 1200},
                {account_id: 1, date: '2017-01-02', 'type': 'deposit', amount: 200},
                {account_id: 1, date: '2017-01-02', 'type': 'deposit', amount: 200},
            ]))
            .then(() => Transaction.refresh())
            .then(() => done());
    });

    after(function(done) {
        Account.delete(1).then(() => done());
    });

    describe('deposit', function() {

        it('shows correct balance', function(done) {
            Account.find(1)
                .then(acc => {
                    Promise.all([
                        acc.balance('2016-31-12'),
                        acc.balance('2017-01-01'),
                        acc.balance('2017-01-02'),
                    ]).then(res => {
                        // TODO: Add tests.
                        console.log(res);
                        done();
                    });
                });
        });
    });
});
