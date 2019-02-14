#!/usr/bin/env node

import program from 'commander';

program
  .version('1.0.0')
  .command('standards', 'add formatting support')
  .parse(process.argv);
