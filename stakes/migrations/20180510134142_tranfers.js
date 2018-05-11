exports.up = function(knex, Promise) {
  return knex.schema.createTable('transfers', function (table) {
    table.increments('id');
    table.integer('accountId').unsigned().notNullable();
    table.enu('type', [
      'Deposit',
      'Withdrawal',
      'SavingsDeposit',
      'SavingsWithdrawal',
      'FundDeposit',
      'FundWithdrawal'
    ]).notNullable();
    table.date('date').notNullable();
    table.string('amount').notNullable();
  });
};

exports.down = function(knex, Promise) {
  knex.schema.dropTable('transfers');
};
