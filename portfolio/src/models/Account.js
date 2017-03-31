const Model = require('objection').Model;

class Account extends Model {
    static get tableName() {
        return 'accounts';
    }
}

Account.knex(require('../db'));

module.exports = Account;
