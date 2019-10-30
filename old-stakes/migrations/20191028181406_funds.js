exports.up = function(knex, Promise) {
  return knex.schema.createTable('funds', function (table) {
    table.increments('id');
    table.string('name', 256).defaultTo(null);
    table.string('tag', 16).notNullable();

    table.unique('tag');
  });
};

exports.down = function(knex, Promise) {
  knex.schema.dropTable('funds');
};
