let Account = require('./Account');
let Transaction = require('./Transaction');
let Balance = require('./Balance');

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
        // TODO: Make Account.delete() function to handle this.
        Transaction
            .query()
            .where('account_id', 1)
            .delete()
            .then(() => {
                return Account
                    .query()
                    .where('name', 'Test account')
                    .delete()
                    .then(() => {});
            })
            .then(() => {
                return Balance
                    .query()
                    .where('account_id', 1)
                    .delete()
                    .then(() => {});
            })
            .then(() => done());
    });

    describe('deposit', function() {

        it('shows correct balance', function(done) {
            // TODO: Add test for balance on days before, during and after.
            Transaction.refresh()
                .then(() => done());
        });
    });
});
