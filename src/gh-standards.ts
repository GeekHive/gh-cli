#!/usr/bin/env node

import program from 'commander';
import install from 'install-packages';
import path from 'path';
import fs from 'fs-extra';
import * as R from 'ramda';
import { standards, Standard, PackageChanges, RuleType } from './standards';

const ERROR_NO_TYPES = 'At least one valid type is required.';
// const ERROR_INVALID_TYPE = (type: string) => `Type ${type} is not supported.`;

function start() {
  program.parse(process.argv);
  if (!program.args.length) {
    console.error(ERROR_NO_TYPES);
    process.exit(1);
  }
  processTypes(program.args);
}

async function processTypes(types: string[]) {
  await processStandards(getSelectedStandards(types));
}

function getSelectedStandards(types: string[]) {
  return standards.filter(standard =>
    types
      // string[] -> boolean[] - whether any keyword of this standard matched the current type
      .map(type => standard.keywords.reduce((p, c) => p || c === type, false))
      // boolean[] -> boolean - whether this standard matched any type
      .reduce((p, c) => p || c, false)
  );
}

async function processStandards(standards: Standard[]) {
  await installDependencies(standards);
  await installDevDependencies(standards);
  await copyTemplates(standards);
  await writeScripts(standards);
}

async function installDependencies(standards: Standard[]) {
  const dependencies = mergePackageList(standards, 'dependencies');
  if (dependencies.length) {
    console.log('> Installing dependencies:', dependencies.join(', '));
    try {
      await install({ packages: dependencies });
    } catch (e) {
      console.error(e);
    }
  } else {
    console.warn('> No dependencies provided');
  }
}

async function installDevDependencies(standards: Standard[]) {
  const devDependencies = mergePackageList(standards, 'devDependencies');
  devDependencies.push('concurrently');
  devDependencies.push('husky');
  // devDependencies.push('husky');
  if (devDependencies.length) {
    console.log('> Installing devDependencies:', devDependencies.join(', '));
    try {
      await install({ packages: devDependencies, saveDev: true });
    } catch (e) {
      console.error(e);
    }
  } else {
    console.warn('> No devDependencies provided');
  }
}

async function copyTemplates(standards: Standard[]) {
  const templates = mergeTemplates(standards);
  if (templates.length) {
    console.log('> Installing templates: ', templates.join(', '));
    templates.forEach(
      async template =>
        await fs.copy(
          path.join(path.dirname(require.resolve('./gh')), template),
          process.cwd(),
          { overwrite: true }
        )
    );
  } else {
    console.warn('> No templates provided');
  }
}

function getMainScripts(type: RuleType, standards: Standard[]) {
  return R.uniq((R.flatten(
    standards.map(s =>
      R.flatten(
        s.rules
          .map(r => (r.type === type && r.mainScript ? r.mainScript : ''))
          .filter(Boolean)
      )
    )
  ) as any) as string[]);
}

const colors = ['red', 'green', 'yellow', 'blue', 'magenta', 'cyan'];

function createConcurrentScript(scripts: string[], killOthersOnFail?: boolean) {
  const k = killOthersOnFail ? ' --kill-others-on-fail' : '';
  const n = scripts.join(',');
  const c = colors.slice(0, scripts.length).join(',');
  const s = scripts.map(s => `\"yarn run ${s}\"`).join(' ');
  return `concurrently${k} -n \"${n}\" -c \"${c}\" ${s}`;
}

async function writeScripts(standards: Standard[]) {
  const scripts = {
    ...mergePackageDictionary(standards, 'scripts'),
    lint: createConcurrentScript(getMainScripts('lint', standards)),
    format: createConcurrentScript(getMainScripts('format', standards))
  };

  const precommitScripts = {
    hooks: {
      'pre-commit': 'yarn run format && yarn run lint'
    }
  };

  if (scripts && precommitScripts) {
    console.log(
      '> Writing scripts to package.json:',
      Object.keys(scripts).join(', ')
    );
    const pkgJsonPath = path.join(process.cwd(), 'package.json');
    const pkg = JSON.parse(fs.readFileSync(pkgJsonPath).toString());
    pkg.scripts = { ...(pkg.scripts || {}), ...scripts };
    pkg.husky = { ...(pkg.husky || {}), ...precommitScripts };
    await fs.writeFile(pkgJsonPath, JSON.stringify(pkg, undefined, 2));
  } else {
    console.warn('No scripts provided.');
  }
}

function mergePackageDictionary<
  K extends keyof Pick<PackageChanges, 'scripts'>
>(standards: Standard[], field: K) {
  return standards
    .map(s =>
      s.rules
        .map(r => (r.packageChanges ? r.packageChanges[field] : []))
        .reduce((p, c) => R.merge(p, c))
    )
    .reduce((p, c) => R.merge(p, c)) as { [name: string]: string };
}

function mergePackageList<
  K extends keyof Pick<PackageChanges, 'dependencies' | 'devDependencies'>
>(standards: Standard[], field: K) {
  return R.uniq(
    standards
      .map(s =>
        s.rules
          .map(r =>
            r.packageChanges && r.packageChanges[field]
              ? (r.packageChanges[field] as string[])
              : []
          )
          .reduce((p = [], c = []) => [...p, ...c])
      )
      .reduce((p = [], c = []) => [...p, ...c]) || []
  );
}

function mergeTemplates(standards: Standard[]): string[] {
  return (R.uniq(
    R.flatten(
      standards.map(s => R.flatten(s.rules.map(r => r.templates || [])))
    )
  ) as any) as string[];
}

start();
