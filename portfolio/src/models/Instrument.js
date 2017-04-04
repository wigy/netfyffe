const Model = require('objection').Model;

class Instrument extends Model {
    static get tableName() {
        return 'instruments';
    }
}

Instrument.knex(require('../db'));

module.exports = Instrument;
