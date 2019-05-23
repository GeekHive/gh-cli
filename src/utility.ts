import fs from 'fs-extra';
import install from 'install-packages';
import path from 'path';
import R, { Dictionary } from 'ramda';
import { PackageChanges, RuleType } from './rules';
import { Standard } from './standards';

export function getSelectedStandards(standards: Standard[], types: string[]) {
  return standards.filter(standard =>
    types
      // string[] -> boolean[] - whether any keyword of this standard matched the current type
      .map(type => standard.keywords.reduce((p, c) => p || c === type, false))
      // boolean[] -> boolean - whether this standard matched any type
      .reduce((p, c) => p || c, false)
  );
}

export async function processStandards(
  standards: Standard[],
  writeScripts: (arr: Standard[]) => Promise<void>
): Promise<void> {
  await installDependencies(standards);
  await installDevDependencies(standards);
  await copyTemplates(standards);
  await writeScripts(standards);
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
  devDependencies.push('concurrently');
  devDependencies.push('husky');
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

export function getMainScripts(
  type: RuleType,
  standards: Standard[]
): string[] {
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

export function checkConcurrentScript(
  pkg: any,
  type: RuleType,
  standards: Standard[]
) {
  const currentScripts: string[] = [];
  const concurrentScript = pkg.scripts[type];
  if (concurrentScript) {
    standards.forEach(standard => {
      if (
        concurrentScript.includes(standard.keywords[0]) &&
        standard.rules[0].mainScript
      ) {
        currentScripts.push(standard.rules[0].mainScript);
      }
    });
  }
  return currentScripts;
}

export function createConcurrentScript(
  command: string,
  scripts: string[],
  killOthersOnFail?: boolean
): string {
  const k = killOthersOnFail ? ' --kill-others-on-fail' : '';
  const n = scripts.join(',');
  const c = colors.slice(0, scripts.length).join(',');
  const s = scripts.map(s => `\"${command} run ${s}\"`).join(' ');
  return `concurrently${k} -n \"${n}\" -c \"${c}\" ${s}`;
}

export function mergePackageDictionary<
  K extends keyof Pick<PackageChanges, 'scripts'>
>(standards: Standard[], field: K): Dictionary<string> {
  return standards
    .map(s =>
      s.rules
        .map(r => (r.packageChanges ? r.packageChanges[field] : []))
        .reduce((p, c) => R.merge(p, c))
    )
    .reduce((p, c) => R.merge(p, c)) as Dictionary<string>;
}

function mergePackageList<
  K extends keyof Pick<PackageChanges, 'dependencies' | 'devDependencies'>
>(standards: Standard[], field: K): string[] {
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
