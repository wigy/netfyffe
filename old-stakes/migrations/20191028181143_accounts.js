exports.up = function(knex, Promise) {
  return knex.schema.createTable('accounts', function (table) {
    table.increments('id');
    table.integer('serviceId').unsigned().notNullable();
    table.integer('fundId').unsigned().notNullable();
    table.string('name', 128).notNullable();
    table.string('number', 8).defaultTo(null);

    table.foreign('serviceId').references('services.id');
    table.foreign('fundId').references('funds.id');

    table.index('serviceId');
    table.index('fundId');
    table.index('number');
  });
};

exports.down = function(knex, Promise) {
  knex.schema.dropTable('accounts');
};
