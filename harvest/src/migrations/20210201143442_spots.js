exports.up = function (knex, Promise) {

    return knex.schema.createTable('spots', function (table) {
        table.string('ticker', 32).notNullable();
        table.datetime('time').notNullable();
        table.decimal('price');

        table.unique(['ticker', 'time']);
    });
};

exports.down = function(knex, Promise) {
    knex.schema.dropTable('spots');
};
