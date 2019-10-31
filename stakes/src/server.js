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

async function investors(req) {
  const investors = await knex('investors').select('id', 'name', 'email', 'tag');
  req.socket.emit('investors', investors);
}

async function funds(req) {
  const funds = await knex('funds').select('*');
  req.socket.emit('funds', funds);
}

async function subscribe(req) {
  if (req.data.target === 'funds') {
    return funds(req);
  }
  if (req.data.target === 'investors') {
    return investors(req);
  }
}

const server = new SocketServerAuth(config, (auth) => login(auth));
server.useDebug();
// TODO: This is just a test.
server.use('subscribe', (req) => subscribe(req));
server.use404();
server.run();
