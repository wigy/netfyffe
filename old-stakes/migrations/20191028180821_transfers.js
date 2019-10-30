exports.up = function(knex, Promise) {
  return knex.schema.createTable('transfers', function (table) {
    table.increments('id');
    table.integer('fromId').unsigned().defaultTo(null);
    table.integer('toId').unsigned().defaultTo(null);
    table.integer('commentId').unsigned().notNullable();

    table.foreign('fromId').references('accounts.id');
    table.foreign('toId').references('accounts.id');
    table.foreign('commentId').references('comments.id');

    table.index('fromId');
    table.index('toId');
  });
};

exports.down = function(knex, Promise) {
  knex.schema.dropTable('transfers');
};
