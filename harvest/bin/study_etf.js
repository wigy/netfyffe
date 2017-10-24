#!/usr/bin/env node
/*
* This script helps you looking for information for particular ETF and updating data files for it.
*/

global.d = require('neat-dump');
const engine = require('../src/engine');
const readline = require('readline');

async function select(data, field, msg = 'Select one: ') {
    if (data.length < 1) {
        d.error('No data found.');
        process.exit();
    }
    if (data.length > 1) {
        let n = 1;
        data.forEach(line => {
            console.log(n + '.', line[field]);
            console.log('  ', JSON.stringify(line));
            n++;
        });
    }
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

if (process.argv.length < 3) {
    console.log('');
    console.log('Usage: study_etf.js <ETF name>');
    console.log('');
} else {
    engine.init();
    const lookup = process.argv.slice(2).join(' ');
    d('Looking for', lookup);
    engine.getTickerSearch(lookup)
    .then((data) => {
            return select(data, 'name');
        })
        .then((data) => {
            console.log(JSON.stringify(data, null, 2));
        });
}
