#!/usr/bin/env node

/**
 * Parse an exported CSV-file from Nordnet and import it the database.
 *
 * usage:
 *   bin/import_nordnet_csv.js <bank name> <name for the account> <ID number of account> <path to the CSV file>
 */

const ArgumentParser = require('argparse').ArgumentParser;
const parser = new ArgumentParser({
  addHelp: true,
  description: 'Utility to load and save knex-based databases.'
});
parser.addArgument('account_name');
parser.addArgument('account_code');
parser.addArgument('csv_file');
const args = parser.parseArgs();

const fs = require('fs');
const parse = require('csv-parse');
const encoding = require('encoding');
const rp = require('request-promise');
const d = require('neat-dump');
const db = require('../src/db');
const config = require('../src/config');
const Account = require('../src/models/Account');
const Transaction = require('../src/models/Transaction');

// Mapping from Nordnet ticker names to  netFyffe tickers.
let tickers = {};
// Hash containing all currencies needed as keys and account IDs once resolved.
let accountIds = {};
// Mapping from Nordnet types to netFyffe types.
let types = {
    'NOSTO': 'withdraw',
    'TALLETUS': 'deposit',
    'MYYNTI': 'sell',
    'OSTO': 'buy',
    'LAJIMAKSU': 'expense',
    'PÄÄOMIT YLIT.KORKO': 'interest',
    'LAINAKORKO': 'interest',
    'VALUUTAN MYYNTI': 'cash-out',
    'VALUUTAN OSTO': 'cash-in',
    'ENNAKKOPIDÄTYS': 'tax',
    'OSINKO': 'divident',
    'AP OTTO': 'out',
    'KORJAUS AP OTTO': 'cancel',
};
// Mapping from old tickers.
let oldTickers = {
    // TODO: This could be in quote-service.
    'UPM1V': 'UPM',
};
// Mapping from few funds.
let funds = {
    // TODO: This should be in quote-service.
    'NN SUPERRAHASTO SUOMI': 'SUPFIN',
    'NN SUPERFONDEN SVERIGE': 'SUPSVE',
    'NN SUPERFONDEN DANMARK': 'SUPDEN',
    'NN SUPERFONDET NORGE': 'SUPNOR',
};

/**
 * Convert a line from Nordnet CSV to transaction structure.
 */
function convert(line) {

    let [id, date1, date2, date3, type, ticker, instr, isin, count, price, interest, fees, total, currency, ...rest] = line;
    let options = {};

    total = parseInt(total.replace(/[ ,]/g, ''));
    if (ticker !== '') {
        if (oldTickers[ticker]) {
            ticker = oldTickers[ticker];
        }
        if (funds[ticker]) {
            ticker = funds[ticker];
        }
        if (!tickers[ticker]) {
            throw Error('Cannot find ticker ' + ticker);
        }
        ticker = tickers[ticker];
    } else {
        ticker = null;
    }
    accountIds[currency] = true;
    if (count === '') {
        count = null;
    } else {
        if (/,/.test(count)) {
            options.float = true;
        }
        count = parseFloat(count.replace(',', '.'));
    }

    if (!types[type]) {
        throw Error('Cannot recognize transaction type ' + type);
    }
    type = types[type];

    return {
        account_id: currency, // To be replaced later account ID.
        date: date3,
        type: type,
        code: ticker,
        count: count,
        amount: total,
        options: JSON.stringify(options),
        applied: false,
    };
}

/**
 * Check the accounts and create if needed.
 */
function checkAccounts(currencies) {
    let accounts = [];
    let existing = [];
    currencies.map(cur => accounts.push({name: args.account_name, code: args.account_code, currency: cur}));
    return Promise.all(accounts.map(acc => db.select('*').from('accounts').where(acc).then(acc => {
        if (acc.length) {
            accountIds[acc[0].currency] = acc[0].id;
            existing.push(acc[0].currency);
        }
    }))).then(() => {
        currencies = currencies.filter(cur => existing.indexOf(cur) < 0);
        return Promise.all(currencies.map(cur => db('accounts').insert(
            {bank: 'Nordnet', name: args.account_name, code: args.account_code, currency: cur}
        ).then(acc => accountIds[cur] = parseInt(acc))));
    });
}

/**
 * Load the CSV-file from the given path and insert data to database.
 */
function load(filepath) {

    let input = encoding.convert(fs.readFileSync(filepath), 'utf-8', 'iso-8859-1').toString();

    parse(input, {comment: '#', delimiter: ';', skip_empty_lines: true}, function(err, output){

        if (err) {
            d.error(err);
            process.exit(1);
        }

        // Collect transactions from CSV.
        let data = [];
        output.splice(0,1);
        output.forEach(line => {
            data.push(convert(line));
        })

        // Check and create accounts if needed.
        checkAccounts(Object.keys(accountIds)).then(() => {
            // Map the account IDs to their place.
            data.map((_,k) => {
                data[k].account_id = accountIds[data[k].account_id];
            });
            // Save transactions.
            return db('transactions').where({
                date: data[0].date,
                type: data[0].type,
                count: data[0].count,
                amount: data[0].amount,
                code: data[0].code,
            }).then(old => {
                if (old.length) {
                    throw new Error("Suspisiously similar transaction " + JSON.stringify(old[0]) + ' found already from DB.');
                }
                db('transactions').insert(data).then(() => {
                    data.map(row => d('Adding', JSON.stringify(row)));
                    d.info('Inserted ' + data.length + ' new transactions.');
                    Transaction.refresh()
                        .then(() => process.exit());
                });
            });
        }).catch(err => {
            d.error(err);
            process.exit();
        });
    });
}

// Load ticker data.
rp({uri: config.quotes, json: true}).then(data => {
    data.map(ticker => tickers[ticker.split(':')[1]] = ticker);
    // Then load CSV file.
    load(args.csv_file);
}).catch(err => d.error("Cannot connect to quotes:", err));
