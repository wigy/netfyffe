exports.up = function (knex, Promise) {
    return knex.schema.createTable('instruments', function (table) {

        table.increments('id');

        table.integer('account_id').unsigned().notNullable();
        table.string('ticker', 32).notNullable();
        table.decimal('count').notNullable();
        table.integer('buy_price').notNullable();
        table.integer('sell_price');
        table.date('bought').notNullable();
        table.date('sold');

        table.index(['ticker']);
    });
};

exports.down = function(knex, Promise) {
    knex.schema.dropTable('instruments');
};
