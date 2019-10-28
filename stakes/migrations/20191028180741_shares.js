exports.up = function(knex, Promise) {
  return knex.schema.createTable('shares', function (table) {
    table.increments('id');
    table.date('date').notNullable();
    table.decimal('amount', null).notNullable();
    table.integer('transferId').unsigned().notNullable();
    table.integer('investorId').unsigned().notNullable();
    table.integer('fundId').unsigned().notNullable();

    table.foreign('transferId').references('transfers.id');
    table.foreign('investorId').references('investors.id');
    table.foreign('fundId').references('funds.id');

    table.index('date');
    table.index('transferId');
    table.index('investorId');
    table.index('fundId');
  });
};

exports.down = function(knex, Promise) {
  knex.schema.dropTable('shares');
};
