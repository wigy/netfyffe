const { SocketServerSync } = require('rtds-server');
const knex = require('knex')(require('../knexfile'));
const config = require('./config');

async function auth(cred) {
  const user = await knex('investors')
    .select('id', 'name', 'email', 'tag')
    .where({email: cred.user})
    .first();
  // TODO: Password check.
  return user;
}

const server = new SocketServerSync(config, { auth });
server.addChannel('investors', {
  read: async () => knex('investors').select('id', 'name', 'email', 'tag'),
  create: async (data) => {
    const id = (await knex('investors').insert(data))[0];
    return knex('investors').select('*').where({ id }).first();
  },
  affects: async (object) => ['investors']
});
server.addChannel('funds', {
  read: async () => knex('funds').select('*')
});
server.addChannel('fund', {
  read: async (filter) => knex('funds').select('*').where(filter.expression),
  affects: async (object) => ['funds', 'fund'],
  update: async (object) => knex('funds').update(object).where({ id: object.id })
});
server.useDebug();
server.use404();
server.run();
