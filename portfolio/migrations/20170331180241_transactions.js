exports.up = function (knex, Promise) {
    return knex.schema.createTable('transactions', function (table) {

        table.increments('id');

        table.integer('account_id').unsigned().notNullable();
        table.date('date').notNullable();
        table.enu('type', ['deposit', 'withdraw', 'buy', 'sell', 'interest', 'tax', 'divident', 'split', 'move-out', 'move-in']).notNullable();
        table.string('code', 32).defaultTo(false);
        table.integer('count').defaultTo(null);
        table.integer('amount').defaultTo(null);
        table.text('options').defaultTo('{}');
        table.boolean('applied').defaultTo(false);

        table.index(['date', 'id']);
        table.index(['account_id', 'date']);
        table.index(['code']);
    });
};

exports.down = function(knex, Promise) {
    knex.schema.dropTable('transactions');
};
