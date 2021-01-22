const { SocketServerLive } = require('rtds-server');
const { Driver } = require('rtds-query');
const knex = require('knex')(require('../knexfile'));
const config = require('./config');
const { getTags } = require('./tilitintin');

// Silly temporary authentication.
async function auth(cred) {
  const user = await knex('investors')
    .select('id', 'name', 'email', 'tag', 'color')
    .where({ email: cred.user })
    .first();
  // TODO: Password check.
  return user;
}

async function main() {

  const driver = Driver.create(`sqlite:///${__dirname}/../development.sqlite`);
  const server = new SocketServerLive(config, { auth, driver });
  await driver.initialize();

  server.makeChannel('investors', {
    select: ['id', 'name', 'email', 'tag', 'color'],
    table: 'investors'
  });

  server.makeChannel('investor', {
    select: ['id', 'name', 'email', 'tag', 'color'],
    table: 'investors'
  }, {
    insert: ['name', 'email', 'tag'],
    table: 'investors'
  }, {
    update: ['name', 'email', 'tag'],
    table: 'investors'
  }, {
    delete: ['id'],
    table: 'investors'
  });

  server.makeChannel('accounts', {
    select: ['id', 'name', 'number'],
    table: 'accounts'
  });

  server.makeChannel('account', {
    select: ['id', 'name', 'number'],
    table: 'accounts',
    members: [
      {
        table: 'funds',
        as: 'fund',
        select: ['id', 'name', 'tag'],
        join: ['accounts.fundId', 'fund.id']
      },
      {
        table: 'services',
        as: 'service',
        select: ['id', 'name', 'tag'],
        join: ['accounts.serviceId', 'service.id']
      }
    ],
    collections: [
      {
        table: 'value_changes',
        as: 'valueChanges',
        select: ['id', 'date', 'amount'],
        join: ['accounts.id', 'valueChanges.accountId'],
        order: 'valueChanges.date',
        members: [
          {
            table: 'comments',
            as: 'comment',
            select: ['id', 'data'],
            leftJoin: ['comment.id', 'valueChanges.commentId'],
            process: { data: 'json' },
            members: [
              {
                table: 'transfers',
                select: ['id', 'commentId'],
                as: 'transfer',
                leftJoin: ['comment.id', 'transfer.commentId'],
                members: [
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
          }
        ]
      }
    ]
  }, {
    insert: ['name', 'number', 'serviceId', 'fundId'],
    table: 'accounts'
  }, {
    update: ['name', 'number', 'serviceId', 'fundId'],
    table: 'accounts'
  }, {
    delete: ['id'],
    table: 'accounts'
  });

  server.makeChannel('funds', {
    table: 'funds',
    select: ['id', 'name', 'tag'],
    collections: [
      {
        table: 'accounts',
        select: ['id', 'number', 'name'],
        join: ['funds.id', 'accounts.fundId'],
        members: [
          {
            table: 'services',
            as: 'service',
            select: ['id', 'name', 'tag'],
            leftJoin: ['service.id', 'accounts.serviceId']
          }
        ]
      }
    ]
  });

  server.makeChannel('fund', {
    table: 'funds',
    select: ['id', 'name', 'tag']
  });

  server.makeChannel('shares', {
    table: 'shares',
    select: ['id', 'date', 'amount', 'fundId'],
    members: [
      {
        table: 'investors',
        as: 'investor',
        select: ['id', 'name', 'tag', 'color'],
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
            process: { data: 'json' },
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

  // Custom handlers.
  server.use('get-tags', async (req, next) => {
    if (config.TILITINTIN_URL) {
      const tags = await getTags();
      req.socket.emit('tags-success', tags);
    } else {
      req.socket.emit('tags-error', 'Not configured.');
    }
  });

  server.noAuth('get-tags');

  // server.useDebug();
  server.use404();
  server.run();
}

main().catch(err => console.error(err));
