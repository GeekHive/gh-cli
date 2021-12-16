#!/usr/bin/env node
'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
var commander_1 = require('commander');
commander_1.program
  .version('1.0.0')
  .command('standards [types]', 'add standards for js, ts, and/or scss.')
  .parse(process.argv);
