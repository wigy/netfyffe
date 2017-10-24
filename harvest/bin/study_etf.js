#!/usr/bin/env node
/*
* This script helps you looking for information for particular ETF and updating data files for it.
*/

global.d = require('neat-dump');
const engine = require('../src/engine');

engine.init();
