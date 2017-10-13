#!/usr/bin/env node
/*
* This script helps you testing a single module during the development.
*/

global.d = require('neat-dump');
const engine = require('../src/engine');
const glob = require('glob');

if (process.argv.length < 3) {
    glob(__dirname + '/../src/modules/**/*-harvest-module.js', {}, (err, files) => {
        console.log('');
        console.log('Usage: test_module.js all|<module1:module2:...> [<getFunction> [<arg1> <arg2>...]]');
        console.log('');
        console.log('  Available modules:');
        console.log('');
        console.log('   ', files.map(path => path.replace(/^.*\/(.*)-harvest-module\.js$/, '$1')).join('\n    '));
        console.log('');
        console.log('  Available functions:');
        console.log('');
        console.log('   ', engine.commands().map(cmd => 'get' + cmd).join('\n    '));
        console.log('');
    });
} else {
    const [_, __, module, cmd, ...args] = process.argv;
    (module === 'all' ? engine.init() : Promise.all(module.split(':').map(m => engine.init(engine.findModule(m)))))
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
