exports.up = function(knex, Promise) {
  return knex.schema.createTable('comments', function (table) {
    table.increments('id');
    table.text('data').notNullable();
  });
};

exports.down = function(knex, Promise) {
  knex.schema.dropTable('comments');
};
