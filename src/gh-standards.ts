#!/usr/bin/env node

import { program } from 'commander';
import fs from 'fs-extra';
import install from 'install-packages';
import path from 'path';
import R, { Dictionary } from 'ramda';
import { PackageChanges, RuleType } from './rules';
import { standards as allStandards, Standard } from './standards';

const ERROR_NO_TYPES = 'At least one valid type is required.';
let command = 'npm';

const colors = ['red', 'green', 'yellow', 'blue', 'magenta', 'cyan'];

function createConcurrentScript(
  scripts: string[],
  killOthersOnFail?: boolean
): string {
  const k = killOthersOnFail ? ' --kill-others-on-fail' : '';
  const n = scripts.join(',');
  const c = colors.slice(0, scripts.length).join(',');
  const s = scripts.map((ps) => `"${command} run ${ps}"`).join(' ');
  return `concurrently${k} -n "${n}" -c "${c}" ${s}`;
}

function mergePackageDictionary<
  K extends keyof Pick<PackageChanges, 'scripts'>
>(standards: Standard[], field: K): Dictionary<string> {
  return standards
    .map((s) =>
      s.rules
        .map((r) => (r.packageChanges ? r.packageChanges[field] : []))
        .reduce((p, c) => (R as any).merge(p, c))
    )
    .reduce((p, c) => (R as any).merge(p, c)) as Dictionary<string>;
}

function mergePackageList<
  K extends keyof Pick<PackageChanges, 'dependencies' | 'devDependencies'>
>(standards: Standard[], field: K): string[] {
  return R.uniq(
    standards
      .map((s) =>
        s.rules
          .map((r) =>
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
  return R.uniq(
    R.flatten(
      standards.map((s) => R.flatten(s.rules.map((r) => r.templates || [])))
    )
  ) as any as string[];
}

function getMainScripts(type: RuleType, standards: Standard[]): string[] {
  return R.uniq(
    R.flatten(
      standards.map((s) =>
        R.flatten(
          s.rules
            .map((r) => (r.type === type && r.mainScript ? r.mainScript : ''))
            .filter(Boolean)
        )
      )
    ) as any as string[]
  );
}

async function writeScripts(standards: Standard[]): Promise<void> {
  const scripts = {
    ...mergePackageDictionary(standards, 'scripts'),
    lint: createConcurrentScript(getMainScripts('lint', standards)),
    format: createConcurrentScript(getMainScripts('format', standards)),
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

function getSelectedStandards(types: string[]) {
  return allStandards.filter((standard) =>
    types
      // string[] -> boolean[] - whether any keyword of this standard matched the current type
      .map((type) => standard.keywords.reduce((p, c) => p || c === type, false))
      // boolean[] -> boolean - whether this standard matched any type
      .reduce((p, c) => p || c, false)
  );
}

async function installDependencies(standards: Standard[]): Promise<void> {
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

async function installDevDependencies(standards: Standard[]): Promise<void> {
  const devDependencies = mergePackageList(standards, 'devDependencies');
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

async function copyTemplates(standards: Standard[]): Promise<void> {
  const templates = mergeTemplates(standards);
  if (templates.length) {
    console.log('> Installing templates: ', templates.join(', '));
    templates.forEach(async (template) =>
      fs.copy(
        path.join(path.dirname(require.resolve('./gh')), template),
        process.cwd(),
        { overwrite: true }
      )
    );
  } else {
    console.warn('> No templates provided');
  }
}

async function processStandards(standards: Standard[]): Promise<void> {
  await installDependencies(standards);
  await installDevDependencies(standards);
  await copyTemplates(standards);
  await writeScripts(standards);
}

async function processTypes(types: string[]) {
  command = await install.determinePackageManager(process.cwd());
  await processStandards(getSelectedStandards(types));
}

function start() {
  program.parse(process.argv);
  if (!program.args.length) {
    console.error(ERROR_NO_TYPES);
    process.exit(1);
  }
  processTypes(program.args);
}

start();
