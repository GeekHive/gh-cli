#!/usr/bin/env node

import program from 'commander';
import fs from 'fs-extra';
import install from 'install-packages';
import path from 'path';
import { accessibilities, Standard } from './standards';
import {
  checkConcurrentScript,
  createConcurrentScript,
  getMainScripts,
  getSelectedStandards,
  mergePackageDictionary,
  processStandards
} from './utility';

let command = 'npm';

function start() {
  program.parse(process.argv);
  if (!program.args.length) {
    // Add all accessibility tools if list of arguments is omitted
    const pkgJsonPath = path.join(process.cwd(), 'package.json');
    const pkg = JSON.parse(fs.readFileSync(pkgJsonPath).toString());
    const allAccessibilities = ['axe', 'pa11y', 'lighthouse'];
    const currentScripts: string[] = checkConcurrentScript(
      pkg,
      'a11y',
      accessibilities
    );
    const allTypes = allAccessibilities.filter(
      type => currentScripts.indexOf(`a11y:${type}`) === -1
    );
    processTypes(allTypes);
  } else {
    processTypes(program.args);
  }
}

async function processTypes(types: string[]) {
  command = await install.determinePackageManager(process.cwd());
  await processStandards(
    getSelectedStandards(accessibilities, types),
    writeScripts
  );
}

async function writeScripts(selectedStandards: Standard[]): Promise<void> {
  const pkgJsonPath = path.join(process.cwd(), 'package.json');
  const pkg = JSON.parse(fs.readFileSync(pkgJsonPath).toString());
  const currentScripts: string[] = checkConcurrentScript(
    pkg,
    'a11y',
    accessibilities
  );
  const allMainScripts: string[] = getMainScripts(
    'a11y',
    selectedStandards
  ).concat(currentScripts);
  const scripts = {
    ...mergePackageDictionary(selectedStandards, 'scripts'),
    a11y: createConcurrentScript(command, allMainScripts)
  };
  console.log(
    '> Writing scripts to package.json:',
    Object.keys(scripts).join(', ')
  );
  pkg.scripts = { ...(pkg.scripts || {}), ...scripts };
  await fs.writeFile(pkgJsonPath, JSON.stringify(pkg, undefined, 2));
}

start();
