// TODO: Split to Bank and AccountGroup
exports.up = function (knex, Promise) {
    return knex.schema.createTable('accounts', function (table) {

        table.increments('id').primary();
        table.string('bank', 256).nullable();
        table.string('name', 256).notNullable();
        table.string('code', 16).notNullable();
        table.string('currency', 3).notNullable();

        table.unique(['bank', 'name', 'currency']);
    });
};

exports.down = function(knex, Promise) {
    knex.schema.dropTable('accounts');
};
