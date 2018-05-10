exports.up = function(knex, Promise) {
  return knex.schema.createTable('accounts', function (table) {
    table.increments('id');
    table.integer('investorId').unsigned().defaultTo(null);
    table.integer('fundId').unsigned().defaultTo(null);
    table.string('name', 64).defaultTo(null);
    table.enu('type', [
      'BankAccount',
      'SavingsAccount',
      'FundAccount'
    ]).notNullable();
  });
};

exports.down = function(knex, Promise) {
  knex.schema.dropTable('accounts');
};
