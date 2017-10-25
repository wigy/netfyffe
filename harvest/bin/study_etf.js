#!/usr/bin/env node
/*
* This script helps you looking for information for particular ETF and updating data files for it.
*/

global.d = require('neat-dump');
const engine = require('../src/engine');
const readline = require('readline');
const lib = require('../src/lib');

function quit(msg) {
    d.error.apply(null, Array.from(arguments));
    process.exit();
}

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
                resolve(data[parseInt(answer) - 1]);
                rl.close();
            });
        });
    }
    return data[0];
}

if (process.argv.length < 3) {

    console.log('');
    console.log('Usage: study_etf.js <ETF name>');
    console.log('');

} else {

    let name, provider, ticker;

    engine.init();
    const lookup = process.argv.slice(2).join(' ');
    d('Looking for', lookup);
    engine.getTickerSearch(lookup)
    .then((data) => {
            return select(data, 'name');
        })
        .then((data) => {
            name = data.name;
            provider = lib.provider.find(name);
            return select(data.available, 'market');
        })
        .then((data) => {
            if (!data.market) {
                quit('No market found from data', data);
            }
            if (!data.ticker) {
                quit('No ticker found from data', data);
            }
            ticker = data.market + ':' + data.ticker;
        })
        .then(() => {
        })
        .then(() => {
        })
        .then(() => {
        })
        .then(() => {
            console.log('Name:', name);
            console.log('Ticker:', ticker);
            console.log('Provider:', provider);
        });
}
