#!/usr/bin/env node

import program from 'commander';
import fs from 'fs-extra';
import install from 'install-packages';
import path from 'path';
import { standards, Standard } from './standards';
import {
  checkConcurrentScript,
  createConcurrentScript,
  getMainScripts,
  getSelectedStandards,
  mergePackageDictionary,
  processStandards
} from './utility';

const ERROR_NO_TYPES = 'At least one valid type is required.';
let command = 'npm';

function start() {
  program.parse(process.argv);
  if (!program.args.length) {
    console.error(ERROR_NO_TYPES);
    process.exit(1);
  }
  processTypes(program.args);
}

async function processTypes(types: string[]) {
  command = await install.determinePackageManager(process.cwd());
  await processStandards(getSelectedStandards(standards, types), writeScripts);
}

async function writeScripts(selectedStandards: Standard[]): Promise<void> {
  const pkgJsonPath = path.join(process.cwd(), 'package.json');
  const pkg = JSON.parse(fs.readFileSync(pkgJsonPath).toString());
  const currentLintScripts: string[] = checkConcurrentScript(
    pkg,
    'lint',
    standards
  );
  const currentFormatScripts: string[] = checkConcurrentScript(
    pkg,
    'format',
    standards
  );
  const allLintScripts: string[] = getMainScripts(
    'lint',
    selectedStandards
  ).concat(currentLintScripts);
  const allFormatScripts: string[] = getMainScripts(
    'format',
    selectedStandards
  ).concat(currentFormatScripts);
  const allUniqueLintScripts = allLintScripts.filter(
    (script, index) => allLintScripts.indexOf(script) === index
  );
  const allUniqueFormatScripts = allFormatScripts.filter(
    (script, index) => allFormatScripts.indexOf(script) === index
  );
  const scripts = {
    ...mergePackageDictionary(selectedStandards, 'scripts'),
    lint: createConcurrentScript(command, allUniqueLintScripts),
    format: createConcurrentScript(command, allUniqueFormatScripts)
  };

  const precommitScripts = {
    hooks: {
      'pre-commit': `${command} run format && ${command} run lint`
    }
  };

  console.log(
    '> Writing scripts to package.json:',
    Object.keys(scripts).join(', ')
  );
  pkg.scripts = { ...(pkg.scripts || {}), ...scripts };
  pkg.husky = { ...(pkg.husky || {}), ...precommitScripts };
  await fs.writeFile(pkgJsonPath, JSON.stringify(pkg, undefined, 2));
}

start();
