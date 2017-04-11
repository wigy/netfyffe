const Account = require('./Account');
const Transaction = require('./Transaction');
const Balance = require('./Balance');

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
        Account.delete(1).then(() => done());
    });

    describe('deposit', function() {

        it('shows correct balance', function(done) {
            // TODO: Add test for balance on days before, during and after.
            Transaction.refresh()
                .then(() => done());
        });
    });
});
