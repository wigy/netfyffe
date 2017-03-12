exports.up = function (knex, Promise) {
    return knex.schema.createTable('tickers', function (t) {
        t.string('ticker', 32).primary().notNullable();
        t.string('name', 256).nullable();
        t.string('country', 6).nullable();
        t.string('currency', 3).notNullable();

        t.index('country');
        t.index('currency');
    });
};

exports.down = function(knex, Promise) {
    knex.schema.dropTable('tickers');
};
