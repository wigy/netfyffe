const Bank = require('./Bank');
const Account = require('./Account');
const AccountGroup= require('./AccountGroup');
const Transaction = require('./Transaction');
const Balance = require('./Balance');
const query = require('../lib/db/query');
const assert = require('assert');

describe('Instrument', function() {

    let account = null;

    before(function(done) {
        Account.findOrCreate('Test Bank', 'Test account', 'ACC001', 'EUR')
        .then(acc => {
            account = acc;
            return query.insert(Transaction, [
                {account_id: account.id, date: '2017-01-01', type: 'buy', code: 'HEL:SIILI', count: 100, amount: -100},
                {account_id: account.id, date: '2017-01-02', type: 'out', code: 'HEL:SIILI', count: 100, amount: 0},
                {account_id: account.id, date: '2017-01-02', type: 'cancel', code: 'HEL:SIILI', count: 100, amount: 0},
                {account_id: account.id, date: '2017-01-03', type: 'buy', code: 'HEL:SIILI', count: 100, amount: -100},
                {account_id: account.id, date: '2017-01-04', type: 'out', code: 'HEL:SIILI', count: 100, amount: 0},
            ]);
        })
        .then(() => Transaction.refresh())
        .then(() => done());
    });

    after(function(done) {
        Account.delete(account.id)
            .then(() => done());
    });

    describe('moving in and out', function() {

        it('ends up with correct count', function(done) {
            Promise.all([
                account.instrumentsByTicker('2016-31-12'),
                account.instrumentsByTicker('2017-01-01'),
                account.instrumentsByTicker('2017-01-02'),
                account.instrumentsByTicker('2017-01-03'),
                account.instrumentsByTicker('2017-01-04'),
                account.instrumentsByTicker('2017-01-05'),
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
