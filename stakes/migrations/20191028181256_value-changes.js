exports.up = function(knex, Promise) {
  return knex.schema.createTable('value_changes', function (table) {
    table.increments('id');
    table.date('date').notNullable();
    table.integer('accountId').unsigned().notNullable();
    table.decimal('amount', null).notNullable();
    table.integer('commentId').unsigned().defaultTo(null);

    table.foreign('accountId').references('accounts.id');

    table.index('date');
    table.index('accountId');
  });
};

exports.down = function(knex, Promise) {
  knex.schema.dropTable('value_changes');
};
