exports.up = function (knex, Promise) {
    return knex.schema.createTable('tickers', function (table) {
        table.string('ticker', 32).primary().notNullable();
        table.string('name', 256).nullable();
        table.string('country', 6).nullable();
        table.string('currency', 3).notNullable();

        table.index('country');
        table.index('currency');
    });
};

exports.down = function(knex, Promise) {
    knex.schema.dropTable('tickers');
};
