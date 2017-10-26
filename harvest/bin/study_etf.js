#!/usr/bin/env node
/*
* This script helps you looking for information for particular ETF and updating data files for it.
*/

global.d = require('neat-dump');
const engine = require('../src/engine');
const readline = require('readline');
const lib = require('../src/lib');

/**
 * Show message and quit.
 */
function quit(msg) {
    d.error.apply(null, Array.from(arguments));
    process.exit();
}

/**
 * Perform a lookup for name and let user select both the instrument and the market.
 */
async function findByName(lookup) {
    let ret;
    return engine.getTickerSearch(lookup, 'name')
        .then(async (data) => {
            return select(data, 'name');
        })
        .then(async (data) => {
            ret = data;
            return select(data.available, 'market');
        })
        .then(data => {ret.market = Object.assign({}, data); return ret;})
}

/**
 * Select from multiple possibe options displaying the given field as a title.
 */
async function select(data, field, msg = 'Select one: ') {
    if (data.length < 1) {
        quit('No data found.');
    }
    if (data.length > 1) {
        let n = 1;
        data.forEach(line => {
            console.log(n + '.', line[field]);
            console.log('  ', JSON.stringify(line));
            n++;
        });

        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });
        return new Promise((resolve, reject) => {
            rl.question(msg, (answer) => {
                if (answer === '') {
                    quit('Quit');
                }
                resolve(data[parseInt(answer) - 1]);
                rl.close();
            });
        });
    }
    return data[0];
}

/**
 * Go through ETF content list and perform name lookup for each.
 */
async function collectContent(provider, items) {
    return new Promise((resolve, reject) => {
        let content = [];
        let remaining = items.length;
        items.forEach(async (item) => {
            d.info('Looking for', item.id);
            let ticker = lib.ticker.find(item.id, provider);
            if (!ticker) {
                let share = await findByName(item.id);
                ticker = share.market.market + ':' + share.market.ticker;
                lib.ticker.save(item.id, provider, ticker);
            }
            content.push({ticker: ticker, count: item.count});
            remaining--;
            if (!remaining) {
                resolve(content);
            }
        });
    });
}

/**
 * Explore the ETF.
 */
async function explore(terms) {

    let name, provider, ticker, content;

    findByName(terms)
    .then((data) => {
        name = data.name;
        provider = lib.provider.find(name);
        if (!provider) {
            quit('No provider found from data', data);
        }
        if (!data.market.market) {
            quit('No market found from data', data);
        }
        if (!data.market.ticker) {
            quit('No ticker found from data', data);
        }
        ticker = data.market.market + ':' + data.market.ticker;
        return engine.getETFContent(provider, ticker);
    })
    .then((data) => {
        switch(data.idIs) {
            case 'name':
                return collectContent(provider, [data.items[7],data.items[8]]);
            default:
                quit('Don\'t know how to handle identfication by', data.idIs);
        }
    })
    .then((content) => {
        console.log('Name:', name);
        console.log('Ticker:', ticker);
        console.log('Provider:', provider);
        console.log('Content:');
        content.forEach((share) => {
            console.log('  ', share.count, share.ticker);
        });
    });
}

if (process.argv.length < 3) {

    console.log('');
    console.log('Usage: study_etf.js <ETF name>');
    console.log('');

} else {

    engine.init();
    const terms = process.argv.slice(2).join(' ');
    d('Looking for', terms);
    explore(terms);
}
