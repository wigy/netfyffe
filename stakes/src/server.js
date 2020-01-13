const { SocketServerSync } = require('rtds-server');
const knex = require('knex')(require('../knexfile'));
const config = require('./config');

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
        req.server.logSync(`Client ${req.connection.id} has now seen`, pks, `on ${channelName}.`);
        return await queryRead.select(driver, filter.expression);
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
        // TODO: Need to fetch PKs explicitly re-using delete query.
        await queryDelete.delete(driver, data);
        return data;
      };
    }

    super(channelName, callbacks);

    this.queryCreate = queryCreate;
    this.queryRead = queryRead;
    this.queryUpdate = queryUpdate;
    this.queryDelete = queryDelete;
  }
}

// If set, display logic of syncing.
const DEBUG_SYNCING = true;

class SocketServerLiveQuery extends SocketServerSync {

  constructor(...args) {
    super(...args);
    // A mapping form table names to set of subscriptions having dependency to the table.
    this.dependencies = {};
  }

  addChannel(channel, channelInstance) {
    if (this.channels[channel]) {
      throw new Error(`Channel ${channel} already defined.`);
    }
    this.channels[channel] = channelInstance;
  }

  /**
   * Create new channel from CRUD queries.
   * @param {String} channelName
   * @param {Object} queryRead
   * @param {Object} [queryCreate]
   * @param {Object} [queryUpdate]
   * @param {Object} [queryDelete]
   */
  makeChannel(channelName, queryRead, queryCreate = null, queryUpdate = null, queryDelete = null) {
    const channel = new LiveQueryChannel(channelName, { queryCreate, queryRead, queryUpdate, queryDelete });
    this.addChannel(channelName, channel);
  }

  /**
   * Read the subscription data again and emit back to the connection.
   * @param {Subscription} sub
   */
  async refresh(sub) {
    const data = await sub.channel.read(sub.filter, {
      connection: sub.connection,
      server: this
    });
    sub.connection.socket.emit(sub.channel.name, data);
  }

  /**
   * Log synchronization debug messages.
   * @param  {any[]} args
   */
  logSync(...args) {
    if (DEBUG_SYNCING) {
      this.log('debug', '\u001b[33m{Sync}\u001b[0m', ...args);
    }
  }

  /**
   * Create new dependencies between tables and subscriptions.
   * @param {Subscription} sub
   * @param {Object<Set<Number>>>} pks
   */
  updateDependency(sub, pks) {
    Object.keys(pks).forEach(tableName => {
      this.dependencies[tableName] = this.dependencies[tableName] || new Set();
      this.dependencies[tableName].add(sub);
    });
  }

  /**
   * Nothing to do.
   * @param {Subscription} sub
   */
  addSubscription(sub) {
  }

  /**
   * Remove from all dependencies.
   * @param {Subscription} sub
   */
  dropSubscription(sub) {
    Object.keys(this.dependencies).forEach(tableName => {
      if (this.dependencies[tableName]) {
        this.dependencies[tableName].delete(sub);
      }
    });
  }

  /**
   * Find all affected subscriptions and refresh them.
   * @param {Request} req
   * @param {Object[]} objects
   * @param {String} event Either 'create', 'update' or 'delete'.
   */
  async synchronize(req, objects, event) {

    // If set, scan through all subscriptions (for debugging purposes)-
    const SAFE = false;
    for (const item of objects) {
      if (item === undefined) {
        continue;
      }

      const { channel, object } = item;

      // TODO: We need to find table and PK for an object in reliable way.
      const tableName = channel;
      const pk = event === 'create' ? null : object.id;
      if (pk === undefined) {
        throw new Error('Proper primary key handling not yet implemented.');
      }
      this.logSync(`Refreshing ${tableName} object with PK`, pk);

      // TODO: This could be the point where we use Redis to parallelize updates.

      let seenSubs = [];
      if (SAFE) {
        // Idiot proof implementation scanning all.
        for (const conn of Object.values(this.connections)) {
          this.logSync(`  Connection ${conn.id}`);
          for (const [channelName, subs] of Object.entries(conn.subscriptions)) {
            this.logSync(`    Channel ${channelName} subscriptions per filter`);
            for (const sub of subs) {
              if (sub.hasSeen(tableName, pk)) {
                seenSubs.push(sub);
                this.logSync(`      [X] ${sub.filter}`);
              } else {
                this.logSync(`      [ ] ${sub.filter}`);
              }
            }
          }
        }
      } else {
        // Smart implementation exploiting dependency book-keeping.
        if (this.dependencies[tableName]) {
          this.logSync(`  Found ${this.dependencies[tableName].size} dependencies`);
          for (const sub of this.dependencies[tableName]) {
            if (sub.hasSeen(tableName, pk)) {
              seenSubs.push(sub);
              this.logSync(`      [X] ${sub.connection.id} ${sub.channel.name} ${sub.filter}`);
            } else {
              this.logSync(`      [ ] ${sub.connection.id} ${sub.channel.name} ${sub.filter}`);
            }
          }
        } else {
          this.logSync(`  Found no dependencies`);
        }
      }

      for (const sub of seenSubs) {
        await this.refresh(sub);
      }
    }
  }
}

async function main() {

  const server = new SocketServerLiveQuery(config, { auth });
  await driver.initialize();

  server.makeChannel('investors', {
    select: ['id', 'name', 'email', 'tag'],
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

  server.makeChannel('investor', {
    select: ['id', 'name', 'email', 'tag'],
    table: 'investors'
  });

  server.makeChannel('accounts', {
    select: ['id', 'name', 'number'],
    table: 'accounts'
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
    ]
  });

  server.makeChannel('funds', {
    table: 'funds',
    select: ['id', 'name', 'tag'],
    collections: [
      {
        table: 'accounts',
        select: ['id', 'number', 'name'],
        join: ['funds.id', 'accounts.fundId']
      }
    ]
  });

  server.useDebug();
  server.use404();
  server.run();
}

main().catch(err => console.error(err));

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
