let Account = require('./Account');
let Transaction = require('./Transaction');

describe('Transaction', function() {

    before(function(done) {
        Account
            .query()
            .insert({id: 1, name: 'Test account', bank: 'Test Bank', code: 'ACC001', currency: 'EUR'})
            .then(() => {
                Transaction
                    .query()
                    .insert({account_id: 1, date: '2017-01-01', 'type': 'deposit', amount: 1200})
                    .then(() => done());
            });
    });

    after(function(done) {
        Transaction
            .query()
            .where('account_id', 1)
            .delete()
            .then(() => {
                Account
                    .query()
                    .where('name', 'Test account')
                    .delete()
                    .then(() => done());
            })
    });

    describe('deposit and withdraw', function() {

        it('adds up currectly', function(done) {
            // TODO: Add test.
            Transaction.refresh()
                .then(() => done());
        });
    });
});
