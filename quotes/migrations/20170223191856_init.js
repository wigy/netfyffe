
exports.up = function (knex, Promise) {
    return knex.schema.createTable('tickers', function (t) {
        t.string('ticker', 32).primary().notNullable();
        t.string('name', 256).nullable();
        t.string('country', 6).nullable();
        t.string('currency', 3).notNullable();

        t.index('country');
        t.index('currency');
    });

    return knex.schema.createTable('quotes', function (t) {
        t.string('ticker', 32).notNullable();
        t.date('date').notNullable();
        t.date('time').nullable();
        t.enu('type', ['open', 'close', 'time', 'latest']).notNullable();

        t.index('ticker,date,type');
        t.index('ticker,type');
    });
};

exports.down = function(knex, Promise) {
    return knex.schema.dropTable('tickers');
    return knex.schema.dropTable('quotes');
};
