const { SocketServerSync } = require('rtds-server');
const knex = require('knex')(require('../knexfile'));
const config = require('./config');

async function login(auth) {
  const user = await knex('investors')
    .select('id', 'name', 'email', 'tag')
    .where({email: auth.user})
    .first();
  // TODO: Password check.
  return user;
}

const server = new SocketServerSync(config, (auth) => login(auth));
server.addChannel('investors', {
  fetch: async () => await knex('investors').select('id', 'name', 'email', 'tag'),
  create: async (data) => {
    const id = (await knex('investors').insert(data))[0];
    const object = knex('investors').select('*').where({ id }).first();
    return object;
  },
  affects: async (object) => ['investors']
});
server.addChannel('funds', {
  fetch: async () => await knex('funds').select('*')
});
server.addChannel('fund', {
  fetch: async (filter) => await knex('funds').select('*').where(filter.expression),
  affects: async (object) => ['funds', 'fund']
});
server.useDebug();
server.use404();
server.run();
