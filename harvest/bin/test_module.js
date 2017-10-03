#!/usr/bin/env node
/*
* This script helps you testing a single module during the development.
*/

global.d = require('neat-dump');
const engine = require('../src/engine');

if (process.argv.length < 3) {
    console.log('Usage: test_module.js all|</full/module/path.js> [<getFunction> [<arg1> <arg2>...]]');
} else {
    const [_, __, module, cmd, ...args] = process.argv;
    (module === 'all' ? engine.init() : engine.init(module))
        .then(() => {
            if (cmd) {
                if (!engine[cmd]) {
                    throw new Error('No such command as ' + cmd);
                }
                engine[cmd].apply(engine, args)
                    .then(res => {
                        console.log('');
                        console.log(cmd, args.join(' '), '=>');
                        console.log('');
                        console.log(JSON.stringify(res, null, 2));
                        console.log('');
                    })
                    .catch(err => d.error(err));
            }
        })
        .catch(err => d.error(err));
}
