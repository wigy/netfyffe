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
  affects: async (object) => ['investors', 'investor'],
  update: async (object) => knex('investors').update(object).where({ id: object.id }),
  del: async (object) => knex('investors').where({ id: object.id }).del(),
});
server.addChannel('investor', {
  read: async (filter) => knex('investors').select('id', 'name', 'email', 'tag').where(filter.expression),
  affects: async (object) => ['investors', 'investor']
});
server.addChannel('funds', {
  read: async () => knex('funds').select('*')
});
server.addChannel('fund', {
  read: async (filter) => knex('funds').select('*').where(filter.expression),
  affects: async (object) => ['funds', 'fund'],
  update: async (object) => knex('funds').update(object).where({ id: object.id })
});
server.addChannel('shares', {
  read: async (filter) => (await knex('shares')
    .select(
      'shares.id',
      'shares.date',
      'shares.amount',
      'investors.name as investorName',
      'fromFund.name as fromFundName',
      'fromAccount.name as fromAccountName',
      'fromValue.amount as fromValueAmount',
      'toValue.amount as toValueAmount',
      'toFund.name as toFundName',
      'toAccount.name as toAccountName',
      'comments.data as comments')
    .join('investors', 'investors.id', 'shares.investorId')
    .join('transfers', 'transfers.id', 'shares.transferId')
    .join('comments', 'comments.id', 'transfers.commentId')
    .leftJoin('value_changes as fromValue', 'fromValue.id', 'transfers.fromId')
    .leftJoin('value_changes as toValue', 'toValue.id', 'transfers.toId')
    .leftJoin('accounts as fromAccount', 'fromAccount.id', 'fromValue.accountId')
    .leftJoin('accounts as toAccount', 'toAccount.id', 'toValue.accountId')
    .leftJoin('funds as fromFund', 'fromFund.id', 'fromAccount.fundId')
    .leftJoin('funds as toFund', 'toFund.id', 'toAccount.fundId')
    .where({'shares.fundId': filter.expression.fundId})
    .orderBy('shares.date')).map(e => ({...e, comments: JSON.parse(e.comments)}))
    // TODO: Sqlite-specific fix.
});
server.useDebug();
server.use404();
server.run();
