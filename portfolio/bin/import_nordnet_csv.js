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
  description: 'Utility to import CSV data from Nordnet account.'
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
    'GERMAN SOL TAX DIV': 'tax',
    'PER ULK KUPONKIVERO': 'cash-cancel',
    'OSINGON PERUUTUS': 'cash-cancel',
    'OSINKO': 'divident',
    'AP OTTO': 'out',
    'JÄTTÖ SIIRTO': 'in',
    'KORJAUS AP OTTO': 'cancel',
    'KORJAUS AP JÄTTÖ': 'cancel',
    'DESIM. ULOSKIRJ. KÄT': 'split-cash',
    'VAIHTO AP-OTTO': 'split-out',
    'VAIHTO AP-JÄTTÖ': 'split-in',
    'DESIM KIRJAUS OTTO': 'DROP',
    'LUNASTUS AP OTTO': 'DROP',
    'LUNASTUS AP KÄT.': 'sell',
};
// Mapping from old tickers.
let oldTickers = {
    // TODO: This could be in quote-service.
    'UPM1V': 'UPM',
    'CPMBV': 'CAPMAN',
    'MEO1V': 'METSO',
    'KESBV': 'KESKOB',
    'NOVO B': 'NOVO-B',
    'OKMETIC OSTOTARJOUSOSAKE': 'OKM1V',
};
// Tickers splitted.
let splitTickers = {
    // TODO: How to get these?
    'NGE.US.OLD/X': 'NGE',
}
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
        if (splitTickers[ticker]) {
            ticker = splitTickers[ticker];
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
    if (type === 'DROP') {
        return null;
    }

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
    return Promise.all(accounts.map(acc => Account.findOrCreate('Nordnet', acc.name, acc.code, acc.currency)))
        .then(accs => accs.map(acc => accountIds[acc.currency] = acc.id));
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
            let converted = convert(line);
            if (converted) {
                data.push(converted);
            }
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
                // Split to the smaller bundles or sqlite will choke.
                let bundles = [];
                while(data.length) {
                    let part = data.splice(0, 25);
                    part.map(row => d('Adding', JSON.stringify(row)));
                    bundles.push(db('transactions').insert(part).then(() => d.info('Inserted ' + part.length + ' new transactions.')));
                }
                Promise.all(bundles)
                    .then(() => {
                        d.info("All transactions added.");
                        process.exit();
                    });
            });
        }).catch(err => {
            d.error(err);
            process.exit(1);
        });
    });
}

// Load ticker data.
rp({uri: config.quotes, json: true}).then(data => {
    data.map(ticker => tickers[ticker.split(':')[1]] = ticker);
    // Then load CSV file.
    load(args.csv_file);
}).catch(err => {d.error("Cannot connect to quotes:", err); process.exit(1)});
