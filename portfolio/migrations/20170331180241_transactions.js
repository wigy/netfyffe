exports.up = function (knex, Promise) {
    return knex.schema.createTable('transactions', function (table) {

        table.increments('id');

        table.integer('account_id').unsigned().notNullable();
        table.date('date').notNullable();
        table.enu('type', [
            'deposit',  // Put cash from outside.
            'withdraw', // Take case to outside.
            'buy',      // Buy an instrument.
            'sell',     // Sell an instrument.
            'interest', // Charged or earned interest amount.
            'tax',      // Taxes deducted.
            'expense',  // Other expense.
            'divident', // Divident payement.
            'split',    // Split the instrument to new value.
            'out',      // Move an instrument to another account.
            'in',       // Receive an instrument from another account.
            'cash-out', // Transfer cash to another account.
            'cash-in'   // Transfer cash from another account.
        ]).notNullable();
        table.string('code', 32).defaultTo(null);
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
