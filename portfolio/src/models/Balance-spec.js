const Bank = require('./Bank');
const Account = require('./Account');
const AccountGroup= require('./AccountGroup');
const Transaction = require('./Transaction');
const Balance = require('./Balance');
const query = require('../lib/db/query');
const assert = require('assert');

describe('Balance', function() {

    before(function(done) {
        // TODO: DRY! Move this to separate test helpers collection.
        query.insert(Bank, [
            {id: 1, name: 'Test Bank'},
        ])
        .then(() => query.insert(AccountGroup, [
            {id: 1, bank_id: 1, name: 'Test account', code: 'ACC001'},
        ]))
        .then(() => query.insert(Account, [
            {id: 1, account_group_id: 1, currency: 'EUR'},
        ]))
        .then(() => query.insert(Transaction, [
            // Test some deposits and withdrawing.
            {account_id: 1, date: '2017-01-01', type: 'deposit', amount: 1200},
            {account_id: 1, date: '2017-01-02', type: 'deposit', amount: 200},
            {account_id: 1, date: '2017-01-03', type: 'deposit', amount: 200},
            {account_id: 1, date: '2017-01-03', type: 'deposit', amount: 200},
            {account_id: 1, date: '2017-01-03', type: 'deposit', amount: 200},
            {account_id: 1, date: '2017-01-04', type: 'withdraw', amount: -2000},
        ]))
        .then(() => Transaction.refresh())
        .then(() => done());
    });

    after(function(done) {
        Bank.delete(1).then(() => done());
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
                        assert(res[4] == 0, 'balance 2017-01-04');
                        assert(res[5] == 0, 'balance 2017-01-05');
                        done();
                    });
                });
        });
    });

});
