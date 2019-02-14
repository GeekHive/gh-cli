#!/usr/bin/env node

import program from 'commander';

program
  .version('1.0.0')
  .command('standards [types]', 'add standards for js, ts, and/or scss.')
  .parse(process.argv);
