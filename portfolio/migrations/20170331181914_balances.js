exports.up = function (knex, Promise) {
    return knex.schema.createTable('balances', function (table) {

        table.integer('account_id').unsigned().notNullable();
        table.date('date').notNullable();
        table.integer('balance');

        table.unique(['account_id', 'balance']);
    });
};

exports.down = function(knex, Promise) {
    knex.schema.dropTable('balances');
};
