const Account = require('./Account');
const Transaction = require('./Transaction');
const Balance = require('./Balance');
const query = require('../lib/db/query');
const assert = require('assert');

describe('Transaction', function() {

    before(function(done) {
        query.insert(Account, {id: 1, name: 'Test account', bank: 'Test Bank', code: 'ACC001', currency: 'EUR'})
            .then(() => query.insert(Transaction, [
                {account_id: 1, date: '2017-01-01', 'type': 'deposit', amount: 1200},
                {account_id: 1, date: '2017-01-02', 'type': 'deposit', amount: 200},
                {account_id: 1, date: '2017-01-03', 'type': 'deposit', amount: 200},
                {account_id: 1, date: '2017-01-03', 'type': 'deposit', amount: 200},
                {account_id: 1, date: '2017-01-03', 'type': 'deposit', amount: 200},
                {account_id: 1, date: '2017-01-04', 'type': 'withdraw', amount: -200},
            ]))
            .then(() => Transaction.refresh())
            .then(() => done());
    });

    after(function(done) {
        Account.delete(1).then(() => done());
    });

    describe('deposit and withdrawal', function() {

        it('shows correct balance', function(done) {
            Account.find(1)
                .then(acc => {
                    Promise.all([
                        acc.balance('2016-31-12'),
                        acc.balance('2017-01-01'),
                        acc.balance('2017-01-02'),
                        acc.balance('2017-01-03'),
                        acc.balance('2017-01-04'),
                        acc.balance('2017-01-05'),
                    ]).then(res => {
                        assert(res[0] == 0, 'balance 2016-31-12');
                        assert(res[1] == 1200, 'balance 2017-01-01');
                        assert(res[2] == 1400, 'balance 2017-01-02');
                        assert(res[3] == 2000, 'balance 2017-01-03');
                        assert(res[4] == 1800, 'balance 2017-01-04');
                        assert(res[5] == 1800, 'balance 2017-01-05');
                        done();
                    });
                });
        });
    });
});
