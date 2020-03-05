exports.up = function(knex, Promise) {
  return knex.schema.createTable('investors', function (table) {
    table.increments('id');
    table.string('email', 256).notNullable();
    table.string('password', 256).defaultTo(null);
    table.string('name', 256).defaultTo(null);
    table.string('tag', 16).notNullable();
    table.string('color', 16).defaultTo(null);

    table.unique('tag');
    table.unique('email');
  });
};

exports.down = function(knex, Promise) {
  knex.schema.dropTable('investors');
};
