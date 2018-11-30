#!/usr/bin/env node

import program from 'commander';
import install from 'install-packages';
import path from 'path';
import fs from 'fs-extra';

const ERROR_INVALID_TYPE = 'A valid type is required.';

function start() {
  program.parse(process.argv);

  const types = program.args;

  if (!types.length) {
    console.error(ERROR_INVALID_TYPE);
    process.exit(1);
  }

  types.forEach(processType);
}

async function processType(type: string) {
  switch (type) {
    case 'js':
      await install({
        packages: ['eslint', '@geekhive/eslint-config-standard'],
        saveDev: true
      });
      fs.copy(
        path.join(path.dirname(require.resolve('./gh')), '../templates/lint/js'), 
        process.cwd()
      );
      break;
    case 'ts':
      await install({
        packages: ['tslint', '@geekhive/tslint-config-standard'],
        saveDev: true
      });
      fs.copy(
        path.join(path.dirname(require.resolve('./gh')), '../templates/lint/ts'), 
        process.cwd()
      );
      break;
    case 'scss':
      await install({
        packages: ['stylelint', '@geekhive/stylelint-config-standard'],
        saveDev: true
      });
      fs.copy(
        path.join(path.dirname(require.resolve('./gh')), '../templates/lint/scss'), 
        process.cwd()
      );
      break;
    default:
      console.error(ERROR_INVALID_TYPE);
      break;
  }
}

start();
