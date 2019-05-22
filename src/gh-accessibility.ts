#!/usr/bin/env node

import program from 'commander';
import fs from 'fs-extra';
import install from 'install-packages';
import path from 'path';
import { accessibilities, Standard } from './standards';
import {
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
    processTypes(['axe', 'pa11y', 'lighthouse']);
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

async function writeScripts(accessibilities: Standard[]): Promise<void> {
  const scripts = {
    ...mergePackageDictionary(accessibilities, 'scripts'),
    a11y: createConcurrentScript(
      command,
      getMainScripts('accessibility', accessibilities)
    )
  };

  console.log(
    '> Writing scripts to package.json:',
    Object.keys(scripts).join(', ')
  );
  const pkgJsonPath = path.join(process.cwd(), 'package.json');
  const pkg = JSON.parse(fs.readFileSync(pkgJsonPath).toString());
  pkg.scripts = { ...(pkg.scripts || {}), ...scripts };
  await fs.writeFile(pkgJsonPath, JSON.stringify(pkg, undefined, 2));
}

start();
