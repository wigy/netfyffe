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
            // Test buying and some selling.
            {account_id: 1, date: '2017-02-01', type: 'deposit', amount: 500000},
            {account_id: 1, date: '2017-02-02', type: 'buy', code: 'HEL:FUM1V', count: 250, amount: -250000},
            {account_id: 1, date: '2017-02-02', type: 'buy', code: 'HEL:PIHLIS', count: 10, amount: -10000},
            {account_id: 1, date: '2017-02-03', type: 'buy', code: 'HEL:PIHLIS', count: 10, amount: -10000},
            {account_id: 1, date: '2017-02-04', type: 'sell', code: 'HEL:FUM1V', count: 200, amount: 220000},
            {account_id: 1, date: '2017-02-05', type: 'sell', code: 'HEL:PIHLIS', count: 15, amount: 15000},
            // Clean up
            {account_id: 1, date: '2017-02-10', type: 'out', code: 'HEL:FUM1V', count: 50, amount: 0},
            {account_id: 1, date: '2017-02-10', type: 'out', code: 'HEL:PIHLIS', count: 5, amount: 0},

            // Verify that selling one separately works.
            {account_id: 1, date: '2017-03-01', type: 'buy', code: 'HEL:OREIT', count: 20, amount: -2000},
            {account_id: 1, date: '2017-03-02', type: 'buy', code: 'HEL:OREIT', count: 10, amount: -1000},
            {account_id: 1, date: '2017-03-03', type: 'sell', code: 'HEL:OREIT', count: 1, amount: 100},
            {account_id: 1, date: '2017-03-04', type: 'sell', code: 'HEL:OREIT', count: 29, amount: 2900},
        ]))
        .then(() => Transaction.refresh())
        .then(() => done());
    });

    after(function(done) {
        Account.delete(1).then(() => done());
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

                        acc.balance('2017-03-01'), acc.instrumentsByTicker('2017-03-01'),
                        acc.balance('2017-03-02'), acc.instrumentsByTicker('2017-03-02'),
                        acc.balance('2017-03-03'), acc.instrumentsByTicker('2017-03-03'),
                        acc.balance('2017-03-04'), acc.instrumentsByTicker('2017-03-04'),

                    ]).then(res => {

                        assert(res[0] == 500000, 'balance 2017-02-01');
                        assert(res[2] == 240000, 'balance 2017-02-02');
                        assert(res[4] == 230000, 'balance 2017-02-03');
                        assert(res[6] == 450000, 'balance 2017-02-04');
                        assert(res[8] == 465000, 'balance 2017-02-05');

                        assert(res[10] == 463000, 'balance 2017-03-01');
                        assert(res[12] == 462000, 'balance 2017-03-02');
                        assert(res[14] == 462100, 'balance 2017-03-03');
                        assert(res[16] == 465000, 'balance 2017-03-04');

                        assert.deepEqual(res[1], {}, 'instruments 2017-02-01');
                        assert.deepEqual(res[3], {'HEL:FUM1V': 250, 'HEL:PIHLIS': 10}, 'instruments 2017-02-02');
                        assert.deepEqual(res[5], {'HEL:FUM1V': 250, 'HEL:PIHLIS': 20}, 'instruments 2017-02-03');
                        assert.deepEqual(res[7], {'HEL:FUM1V': 50, 'HEL:PIHLIS': 20}, 'instruments 2017-02-04');
                        assert.deepEqual(res[9], {'HEL:FUM1V': 50, 'HEL:PIHLIS': 5}, 'instruments 2017-02-05');

                        assert.deepEqual(res[11], {'HEL:OREIT': 20}, 'instruments 2017-03-01');
                        assert.deepEqual(res[13], {'HEL:OREIT': 30}, 'instruments 2017-03-02');
                        assert.deepEqual(res[15], {'HEL:OREIT': 29}, 'instruments 2017-03-03');
                        assert.deepEqual(res[17], {}, 'instruments 2017-03-04');

                        done();
                    });
                });
        });
    });
});
