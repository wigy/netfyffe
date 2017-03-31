exports.up = function (knex, Promise) {
    return knex.schema.createTable('accounts', function (table) {

        table.increments('id').primary();
        table.string('name', 256).notNullable();
        table.string('code', 16).notNullable();
        table.string('currency', 3).notNullable();
        table.string('location', 256).nullable();

        table.unique(['name', 'currency']);
    });
};

exports.down = function(knex, Promise) {
    knex.schema.dropTable('accounts');
};
