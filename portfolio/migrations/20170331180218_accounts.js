exports.up = function (knex, Promise) {
    return knex.schema.createTable('accounts', function (table) {

        table.increments('id').primary();
        table.integer('account_group_id').unsigned().notNullable();
        table.string('currency', 3).notNullable();

        table.unique(['account_group_id', 'currency']);
    });
};

exports.down = function(knex, Promise) {
    knex.schema.dropTable('accounts');
};
