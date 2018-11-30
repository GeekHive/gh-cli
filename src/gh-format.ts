#!/usr/bin/env node

import program from 'commander';
import install from 'install-packages';
import path from 'path';
import fs from 'fs-extra';

function start() {
  program.parse(process.argv);
  processFormat();
}

async function processFormat() {
  await install({
    packages: ['prettier'],
    saveDev: true
  });
  fs.copy(
    path.join(path.dirname(require.resolve('./gh')), '../templates/format'), 
    process.cwd()
  );
}

start();
