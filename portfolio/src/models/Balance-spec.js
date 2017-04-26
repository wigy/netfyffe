const Bank = require('./Bank');
const Account = require('./Account');
const AccountGroup= require('./AccountGroup');
const Transaction = require('./Transaction');
const Balance = require('./Balance');
const query = require('../lib/db/query');
const assert = require('assert');

describe('Balance', function() {

    let account = null;

    before(function(done) {
        Account.findOrCreate('Test Bank', 'Test account', 'ACC001', 'EUR')
        .then(acc => {
            account = acc;
            return query.insert(Transaction, [
                // Test some deposits and withdrawing.
                {account_id: account.id, date: '2017-01-01', type: 'deposit', amount: 1200},
                {account_id: account.id, date: '2017-01-02', type: 'deposit', amount: 200},
                {account_id: account.id, date: '2017-01-03', type: 'deposit', amount: 200},
                {account_id: account.id, date: '2017-01-03', type: 'deposit', amount: 200},
                {account_id: account.id, date: '2017-01-03', type: 'deposit', amount: 200},
                {account_id: account.id, date: '2017-01-04', type: 'withdraw', amount: -2000},
            ]);
        })
        .then(() => Transaction.refresh())
        .then(() => done());
    });

    after(function(done) {
        Account.delete(account.id)
            .then(() => done());
    });

    describe('deposit and withdrawal', function() {

        it('shows correct balance', function(done) {
            Promise.all([
                account.balance('2016-31-12'),
                account.balance('2017-01-01'),
                account.balance('2017-01-02'),
                account.balance('2017-01-03'),
                account.balance('2017-01-04'),
                account.balance('2017-01-05'),
            ]).then(res => {
                assert(res[0] == 0, 'balance 2016-31-12');
                assert(res[1] == 1200, 'balance 2017-01-01');
                assert(res[2] == 1400, 'balance 2017-01-02');
                assert(res[3] == 2000, 'balance 2017-01-03');
                assert(res[4] == 0, 'balance 2017-01-04');
                assert(res[5] == 0, 'balance 2017-01-05');
                done();
            });
        });
    });

});
