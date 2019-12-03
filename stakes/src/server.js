const { SocketServerSync } = require('rtds-server');
const knex = require('knex')(require('../knexfile'));
const config = require('./config');

/** Sketches for rtds query implementation */
const { Query, Driver } = require('rtds-query');
const driver = Driver.create(`sqlite:///${__dirname}/../development.sqlite`);
/*
// investors
const q1 = new Query({
  table: 'investors',
  select: ['id', 'name', 'email', 'tag']
});
driver.getAll(q1).then((data) => console.log(data));
*/

// shares
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
          table: 'value_changes',
          as: 'from',
          select: ['id', 'amount'],
          leftJoin: ['from.id', 'transfer.fromId'],
          members: [
            /* {
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
            } */
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
driver.getAll(q4).then((data) => console.dir(data, {depth: null}));
/*******************************************/

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
        "aggregate": ["funds.id", "accounts.fundId"]
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
        "join": ["shares.investorId", "investors.id"]
      },
      {
        "table": "transfers",
        "join": ["shares.investorId", "investors.id"],
        "members": [
          {
            "name": "from",
            "table": "value_changes",
            "select": ["id", "amount"]
            "leftJoin": ["from.id", "transfers.fromId"],
            "members": [
              {
                "table": "accounts",
                "select": ["id", "name", "number"],
                "leftJoin": ["accounts.id", "from.accountId"],
                "members": {
                  "table": "funds",
                  "select": ["id", "name"],
                  "leftJoin": ["funds.id", "accounts.fundId"]
                }
              }
            ]
          },
          {
            "name": "to",
            "table": "value_changes",
            "select": ["id", "amount"]
            "leftJoin": ["to.id", "transfers.toId"],
            "members": [
              {
                "table": "accounts",
                "select": ["id", "name", "number"],
                "leftJoin": ["accounts.id", "to.accountId"],
                "members": {
                  "table": "funds",
                  "select": ["id", "name"],
                  "leftJoin": ["funds.id", "accounts.fundId"]
                }
              }
            ]
          }
        ]
      }
    ]
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
    // TODO: JSON.parse is sqlite-specific fix. Switch to PSQL permanently?
});
server.useDebug();
server.use404();
server.run();
