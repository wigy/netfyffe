exports.up = function (knex, Promise) {

    return knex.schema.createTable('quotes', function (table) {
        table.string('ticker', 32).notNullable();
        table.date('date').notNullable();
        table.decimal('open');
        table.decimal('high');
        table.decimal('low');
        table.decimal('close');
        table.integer('volume').notNullable();

        table.unique(['ticker', 'date']);
    });
};

exports.down = function(knex, Promise) {
    knex.schema.dropTable('quotes');
};
