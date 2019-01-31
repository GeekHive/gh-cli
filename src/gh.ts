#!/usr/bin/env node

import program from 'commander';

program
  .version('1.0.0')
  .command(
    'lint [type]',
    `add linter support for a file type ('js', 'ts', 'scss')`
  )
  .command('format', 'add formatting support')
  .command('standards', 'add formatting support')
  .parse(process.argv);
