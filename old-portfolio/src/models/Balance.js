const Model = require('objection').Model;

class Balance extends Model {
    static get tableName() {
        return 'balances';
    }
}

Balance.knex(require('../db'));

module.exports = Balance;
