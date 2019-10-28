#!/usr/bin/env node

/**
 * This utility is mainly useful for developement.
 * When executed, it retries to accomplish all transactions
 * that haven't been applied yet.
 */
const Transaction = require('../src/models/Transaction');
global.d = require('neat-dump');

Transaction.refresh().finally(() => process.exit());
