const { SocketServerAuth } = require('rtds-server');
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

// TODO: This is just a sketch. Move it where it belongs once complete.
const channels = {
  investors: {
    fetch: async () => await knex('investors').select('id', 'name', 'email', 'tag'),
    create: async (data) => await knex('investors').insert(data)
  },
  funds: {
    fetch: async () => await knex('funds').select('*')
  },
  fund: {
    fetch: async (filter) => await knex('funds').select('*').where(filter)
  }
};

async function subscribe(req) {
  req.connection.subscribe(req.data.channel, req.data.filter || null);
  const res = await channels[req.data.channel].fetch(req.data.filter);
  req.socket.emit(req.data.channel, res);
}

async function unsubscribe(req) {
  req.connection.unsubscribe(req.data.channel, req.data.filter || null);
}

async function createObject(req, channel, data) {
  await channels[channel].create(data);
  // TODO: Resolve also cross channel dependencies.
  for (const conn of req.server.listeners(channel)) {
    for (const filter of conn.filters(channel)) {
      console.log('Debug: Refreshing', conn.id, channel, filter);
      const data = await channels[channel].fetch(filter);
      conn.socket.emit(channel, data);
    }
  }
}

async function createObjects(req) {
  for (const [k, v] of Object.entries(req.data)) {
    if (k === 'token') {
      continue;
    }
    if (v instanceof Array) {
      for (data of v) {
        await createObject(req, k, data);
      }
    } else if (v instanceof Object) {
      await createObject(req, k, v);
    } else {
      console.error(`Invalid object initialization ${JSON.stringify(v)} for ${k}.`);
    }
  }
}

const server = new SocketServerAuth(config, (auth) => login(auth));
server.useDebug();
// TODO: This is just a test.
server.use('subscribe', async (req) => subscribe(req));
server.use('unsubscribe', async (req) => unsubscribe(req));
server.use('create-objects', async (req) => createObjects(req));
server.use404();
server.run();
