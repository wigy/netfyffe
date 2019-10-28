exports.up = function (knex, Promise) {
    return knex.schema.createTable('banks', function (table) {

        table.increments('id').primary();
        table.string('name', 256).notNullable();

        table.unique(['name']);
    });
};

exports.down = function(knex, Promise) {
    knex.schema.dropTable('banks');
};
