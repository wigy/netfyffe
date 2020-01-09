const { SocketServerSync } = require('rtds-server');
const knex = require('knex')(require('../knexfile'));
const config = require('./config');

const USE_NEW_QUERY = true;

// Silly temporary authentication.
async function auth(cred) {
  const user = await knex('investors')
    .select('id', 'name', 'email', 'tag')
    .where({email: cred.user})
    .first();
  // TODO: Password check.
  return user;
}

/** Sketches for rtds query implementation */
const { Query, Driver } = require('rtds-query');
const { Channel } = require('rtds-server');
const driver = Driver.create(`sqlite:///${__dirname}/../development.sqlite`);

class LiveQueryChannel extends Channel {
  constructor(channelName, { queryCreate, queryRead, queryUpdate, queryDelete }) {
    const callbacks = {};

    if (queryCreate) {
      queryCreate = new Query(queryCreate);
      callbacks.create = async (data) => {
        return queryCreate.create(driver, data);
      };
    }

    if (queryRead) {
      queryRead = new Query(queryRead);
      callbacks.read = async (filter, req) => {
        const pks = await queryRead.selectPKs().allPKs(driver, filter.expression);
        req.connection.updateLatestRead(this, filter, pks);
        return queryRead.select(driver, filter.expression);
      };
    }

    if (queryUpdate) {
      queryUpdate = new Query(queryUpdate);
      callbacks.update = async (data) => {
        return queryUpdate.update(driver, data);
      };
    }

    if (queryDelete) {
      queryDelete = new Query(queryDelete);
      callbacks.del = async (data) => {
        return queryDelete.delete(driver, data);
      };
    }

    super(channelName, callbacks);

    this.queryCreate = queryCreate;
    this.queryRead = queryRead;
    this.queryUpdate = queryUpdate;
    this.queryDelete = queryDelete;
  }
}

class SocketServerLiveQuery extends SocketServerSync {

  addChannel(channel, channelInstance) {
    if (this.channels[channel]) {
      throw new Error(`Channel ${channel} already defined.`);
    }
    this.channels[channel] = channelInstance;
  }

  makeChannel(channelName, queryCreate, queryRead, queryUpdate, queryDelete) {
    const channel = new LiveQueryChannel(channelName, { queryCreate, queryRead, queryUpdate, queryDelete });
    this.addChannel(channelName, channel);
  }

  /**
   * Read the subscription data again and emit back to the connection.
   * @param {Subscription} sub
   */
  async refresh(sub) {
    const data = await sub.channel.read(sub.filter, {connection: sub.connection});
    sub.connection.socket.emit(sub.channel.name, data);
  }

  /**
   * Find all affected subscriptions and refresh them.
   * @param {Request} req
   * @param {Object[]} objects
   */
  async synchronize(req, objects) {
    for (const item of objects) {
      if (item === undefined) {
        continue;
      }
      const { channel, object } = item;
      // TODO: This needs extensive debugging info, with some flag.
      // TODO: We need to find table and PK for an object in reliable way.
      const table = channel;
      const pk = object.id;
      // TODO: This could be the point where we use Redis to parallelize updates.
      // TODO: We need to maintain mapping from tables to subscriptions affected.
      //       Then this can be done in much faster manner.
      let seenSubs = [];
      for (const conn of Object.values(this.connections)) {
        for (const [channel, subs] of Object.entries(conn.subscriptions)) {
          for (const sub of subs) {
            if (sub.hasSeen(table, pk)) {
              seenSubs.push(sub);
            }
          }
        }
      }
      for (const sub of seenSubs) {
        await this.refresh(sub);
      }
    }
  }
}

if (USE_NEW_QUERY) {

const server = new SocketServerLiveQuery(config, { auth });

server.makeChannel('investors', {
  insert: ['name', 'email', 'tag'],
  table: 'investors'
}, {
  select: ['id', 'name', 'email', 'tag'],
  table: 'investors'
}, {
  update: ['name', 'email', 'tag'],
  table: 'investors'
}, {
  delete: ['id'],
  table: 'investors'
});

server.useDebug();
server.use404();
server.run();

} else {

// shares
/*
const q4 = new Query({
  table: 'shares',
  select: ['id', 'date', 'amount'],
  members: [
    {
      table: 'investors',
      as: 'investor',
      select: ['id', 'name'],
      join: ['shares.investorId', 'investor.id']
    },
    {
      table: 'transfers',
      as: 'transfer',
      select: 'id',
      join: ['shares.transferId', 'transfer.id'],
      members: [
        {
          table: 'comments',
          select: ['id', 'data'],
          process: {'data': 'json'},
          join: ['comments.id', 'transfer.commentId']
        },
        {
          table: 'value_changes',
          as: 'from',
          select: ['id', 'amount'],
          leftJoin: ['from.id', 'transfer.fromId'],
          members: [
            {
              table: 'accounts',
              as: 'account',
              select: ['id', 'name', 'number'],
              leftJoin: ['account.id', 'from.accountId'],
              members: [
                {
                  table: 'funds',
                  as: 'fund',
                  select: ['id', 'name'],
                  leftJoin: ['fund.id', 'account.fundId']
                }
              ]
            }
          ]
        },
        {
          table: 'value_changes',
          as: 'to',
          select: ['id', 'amount'],
          leftJoin: ['to.id', 'transfer.toId'],
          members: [
            {
              table: 'accounts',
              as: 'account',
              select: ['id', 'name', 'number'],
              leftJoin: ['account.id', 'to.accountId'],
              members: [
                {
                  table: 'funds',
                  as: 'fund',
                  select: ['id', 'name'],
                  leftJoin: ['fund.id', 'account.fundId']
                }
              ]
            }
          ]
        }
      ]
    }
  ]
});
driver.select(q4).then((data) => console.dir(data, {depth: null}));
*/
/*******************************************/

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

server.addChannel('fund', {
  read: async (filter) => knex('funds').select('*').where(filter.expression),
  affects: async (object) => ['funds', 'fund'],
  update: async (object) => knex('funds').update(object).where({ id: object.id })
});
/*
  Proposal for definition format:

  {
    "table": "funds",
    "select": ["id", "name", "tag"],
    "collections": [
      {
        "table": "accounts",
        "select": ["id", "number", "name"],
        "join": ["funds.id", "accounts.fundId"]
      }
    ]
  }
*/
server.addChannel('funds', {
  read: async () => (await knex('funds')
    .select(
      'funds.id',
      'funds.name',
      'funds.tag',
      'accounts.id AS accountId',
      'accounts.name AS accountName',
      'accounts.number AS accountNumber'
      )
     .join('accounts', 'accounts.fundId', 'funds.id')
     .then(entries => {
      const funds = {};
      for (const e of entries) {
        const account = {
          id: e.accountId,
          name: e.accountName,
          number: e.accountNumber
        };
        if (!funds[e.id]) {
          funds[e.id] = {
            id: e.id,
            name: e.name,
            tag: e.tag,
            accounts: [account]
          }
        } else {
          funds[e.id].accounts.push(account);
        }
      }
      return Object.values(funds);
    }))
});
/*
  Proposal for definition format:

  {
    "members": [
      {
        "table": "comments",
        "select": ["id", "data"],
        "join": ["transfer.commentId", "comments.id"]
      }
  }
*/
server.addChannel('shares', {
  read: async (filter) => (await knex('shares')
    .select(
      'shares.id',
      'shares.date',
      'shares.amount',
      'investors.id as investorId',
      'investors.name as investorName',
      'fromFund.id as fromFundId',
      'fromFund.name as fromFundName',
      'fromAccount.name as fromAccountName',
      'fromValue.id as fromValueId',
      'fromValue.amount as fromValueAmount',
      'toValue.id as toValueId',
      'toValue.amount as toValueAmount',
      'toFund.id as toFundId',
      'toFund.name as toFundName',
      'toAccount.name as toAccountName',
      'comments.id as commentsId',
      'comments.data as commentsData')
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
    .orderBy('shares.date'))
    .map(e => ({
      id: e.id,
      date: e.date,
      amount: e.amount,
      investor: {id: e.investorId, name: e.investorName},
      transfer: {
        from: {
          id: e.fromValueId,
          amount: e.fromValueAmount,
          account: {
            id: e.fromAccountId,
            name: e.fromAccountName,
            fund: {
              id: e.fromFundId,
              name: e.fromFundName
            }
          }
        },
        to: {
          id: e.toValueId,
          amount: e.toValueAmount,
          account: {
            id: e.toAccountId,
            name: e.toAccountName,
            fund: {
              id: e.toFundId,
              name: e.toFundName
            }
          }
        }
      },
      comment: {id: e.commentsId, data: JSON.parse(e.commentsData)}
    }))
});
server.useDebug();
server.use404();
server.run();
}
