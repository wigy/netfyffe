exports.up = function(knex, Promise) {
  return knex.schema.createTable('investors', function (table) {
    table.increments('id');
    table.string('nick', 64).notNullable();
    table.string('password', 256).defaultTo(null);
    table.string('tag', 16).notNullable();
    table.string('fullName', 256).defaultTo(null);

    table.index('tag');
    table.index('nick');
  });
};

exports.down = function(knex, Promise) {
  knex.schema.dropTable('investors');
};
