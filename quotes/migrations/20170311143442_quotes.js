exports.up = function (knex, Promise) {

    return knex.schema.createTable('quotes', function (t) {
        t.string('ticker', 32).notNullable();
        t.date('date').notNullable();
        t.decimal('open').notNullable();
        t.decimal('high');
        t.decimal('low');
        t.decimal('close');
        t.integer('volume');

        t.unique(['ticker', 'date']);
    });
};

exports.down = function(knex, Promise) {
    knex.schema.dropTable('quotes');
};
