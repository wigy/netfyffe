exports.up = function (knex, Promise) {
    return knex.schema.createTable('balances', function (table) {

        table.increments('id');

        table.integer('account_id').unsigned().notNullable();
        table.date('date').notNullable();
        table.integer('balance').notNullable();

        table.unique(['account_id', 'date']);
    });
};

exports.down = function(knex, Promise) {
    knex.schema.dropTable('balances');
};
