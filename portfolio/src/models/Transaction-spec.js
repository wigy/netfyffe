const Account = require('./Account');
const Transaction = require('./Transaction');
const Balance = require('./Balance');
const query = require('../lib/db/query');
const assert = require('assert');

describe('Transaction', function() {

    before(function(done) {
        query.insert(Account, [
            {id: 1, name: 'Test account', bank: 'Test Bank', code: 'ACC001', currency: 'EUR'},
        ])
        .then(() => query.insert(Transaction, [
            {account_id: 1, date: '2017-01-01', type: 'deposit', amount: 1200},
            {account_id: 1, date: '2017-01-02', type: 'deposit', amount: 200},
            {account_id: 1, date: '2017-01-03', type: 'deposit', amount: 200},
            {account_id: 1, date: '2017-01-03', type: 'deposit', amount: 200},
            {account_id: 1, date: '2017-01-03', type: 'deposit', amount: 200},
            {account_id: 1, date: '2017-01-04', type: 'withdraw', amount: -2000},

            {account_id: 1, date: '2017-02-01', type: 'deposit', amount: 500000},
            {account_id: 1, date: '2017-02-02', type: 'buy', code: 'HEL:FUM1V', count: 250, amount: -250000},
            {account_id: 1, date: '2017-02-02', type: 'buy', code: 'HEL:PIHLIS', count: 10, amount: -10000},
            {account_id: 1, date: '2017-02-03', type: 'buy', code: 'HEL:PIHLIS', count: 10, amount: -10000},
            {account_id: 1, date: '2017-02-04', type: 'sell', code: 'HEL:FUM1V', count: 200, amount: 220000},
            {account_id: 1, date: '2017-02-05', type: 'sell', code: 'HEL:PIHLIS', count: 15, amount: 15000},

/*
TODO: This will break.
            {account_id: 1, date: '2017-02-01', type: 'buy', code: 'HEL:OREIT', count: 20, amount: 2000},
            {account_id: 1, date: '2017-02-02', type: 'buy', code: 'HEL:OREIT', count: 10, amount: 1000},
            {account_id: 1, date: '2017-02-03', type: 'sell', code: 'HEL:OREIT', count: 1, amount: -100},
            {account_id: 1, date: '2017-02-04', type: 'sell', code: 'HEL:OREIT', count: 29, amount: -2900},
*/
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
                        assert(res[4] == 0, 'balance 2017-01-04');
                        assert(res[5] == 0, 'balance 2017-01-05');
                        done();
                    });
                });
        });
    });

    describe('buying and selling', function() {

        it('shows correct balance and instruments', function(done) {
            Account.find(1)
                .then(acc => {
                    Promise.all([
                        acc.balance('2017-02-01'), acc.instrumentsByTicker('2017-02-01'),
                        acc.balance('2017-02-02'), acc.instrumentsByTicker('2017-02-02'),
                        acc.balance('2017-02-03'), acc.instrumentsByTicker('2017-02-03'),
                        acc.balance('2017-02-04'), acc.instrumentsByTicker('2017-02-04'),
                        acc.balance('2017-02-05'), acc.instrumentsByTicker('2017-02-05'),
                    ]).then(res => {
                        assert(res[0] == 500000, 'balance 2017-02-01');
                        assert(res[2] == 240000, 'balance 2017-02-02');
                        assert(res[4] == 230000, 'balance 2017-02-03');
                        assert(res[6] == 450000, 'balance 2017-02-04');
                        assert(res[8] == 465000, 'balance 2017-02-05');
                        assert.deepEqual(res[1], {}, 'instruments 2017-02-01');
                        assert.deepEqual(res[3], {'HEL:FUM1V': 250, 'HEL:PIHLIS': 10}, 'instruments 2017-02-02');
                        assert.deepEqual(res[5], {'HEL:FUM1V': 250, 'HEL:PIHLIS': 20}, 'instruments 2017-02-03');
                        assert.deepEqual(res[7], {'HEL:FUM1V': 50, 'HEL:PIHLIS': 20}, 'instruments 2017-02-04');
                        assert.deepEqual(res[9], {'HEL:FUM1V': 50, 'HEL:PIHLIS': 5}, 'instruments 2017-02-05');
                        done();
                    });
                });
        });
    });
});
