exports.up = function (knex, Promise) {
    return knex.schema.createTable('instruments', function (table) {

        table.increments('id');

        table.integer('account_id').unsigned().notNullable();
        table.string('ticker', 32).notNullable();
        table.integer('count').notNullable();
        table.integer('price').notNullable();
        table.date('bought').notNullable();
        table.date('sold');

        table.index(['ticker']);
    });
};

exports.down = function(knex, Promise) {
    knex.schema.dropTable('instruments');
};
