exports.up = function (knex, Promise) {
    return knex.schema.createTable('account_groups', function (table) {

        table.increments('id').primary();
        table.integer('bank_id').unsigned().notNullable();
        table.string('name', 256).notNullable();
        table.string('code', 16).notNullable();

        table.unique(['bank_id', 'name']);
    });
};

exports.down = function(knex, Promise) {
    knex.schema.dropTable('account_groups');
};
