const Account = require('./Account');
const Transaction = require('./Transaction');
const Balance = require('./Balance');
const query = require('../lib/db/query');
const assert = require('assert');

describe('Instrument', function() {

    before(function(done) {
        query.insert(Account, [
            {id: 1, name: 'Test account', bank: 'Test Bank', code: 'ACC001', currency: 'EUR'},
            {id: 2, name: 'Test account 2', bank: 'Test Bank', code: 'ACC002', currency: 'EUR'},
        ])
        .then(() => query.insert(Transaction, [
            {account_id: 1, date: '2017-01-01', type: 'buy', code: 'HEL:SIILI', count: 100, amount: -100},
            {account_id: 1, date: '2017-01-02', type: 'out', code: 'HEL:SIILI', count: 100, amount: 0},
            {account_id: 1, date: '2017-01-02', type: 'cancel', code: 'HEL:SIILI', count: 100, amount: 0},
            {account_id: 1, date: '2017-01-03', type: 'buy', code: 'HEL:SIILI', count: 100, amount: -100},
            {account_id: 1, date: '2017-01-04', type: 'out', code: 'HEL:SIILI', count: 100, amount: 0},
        ]))
        .then(() => Transaction.refresh())
        .then(() => done());
    });

    after(function(done) {
        Account.delete(1)
            .then(() => Account.delete(2))
            .then(() => done());
    });

    describe('moving in and out', function() {

        it('ends up with correct count', function(done) {
            Account.find(1)
                .then(acc => {
                    Promise.all([
                        acc.instrumentsByTicker('2016-31-12'),
                        acc.instrumentsByTicker('2017-01-01'),
                        acc.instrumentsByTicker('2017-01-02'),
                        acc.instrumentsByTicker('2017-01-03'),
                        acc.instrumentsByTicker('2017-01-04'),
                        acc.instrumentsByTicker('2017-01-05'),
                    ]).then(res => {
                        assert.deepEqual(res[0], {}, 'instruments 2016-31-12');
                        assert.deepEqual(res[1], {'HEL:SIILI': 100}, 'instruments 2017-01-01');
                        assert.deepEqual(res[2], {'HEL:SIILI': 100}, 'instruments 2017-01-02');
                        assert.deepEqual(res[3], {'HEL:SIILI': 200}, 'instruments 2017-01-03');
                        assert.deepEqual(res[4], {'HEL:SIILI': 100}, 'instruments 2017-01-04');
                        assert.deepEqual(res[5], {'HEL:SIILI': 100}, 'instruments 2017-01-05');
                        done();
                    });
                });
        });
    });
});
