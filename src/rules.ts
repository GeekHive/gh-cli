/** Supported rule types */
export type RuleType = 'tooling' | 'lint' | 'format';

/** Dictionary of scripts */
export interface Scripts {
  [name: string]: string;
}

/** Changes to `package.json` */
export interface PackageChanges {
  dependencies?: string[];
  devDependencies?: string[];
  scripts?: Scripts;
}

/** A rule is a collection of dependencies, scripts, and files. */
export interface Rule {
  type: RuleType;
  name: string;
  description: string;
  packageChanges?: PackageChanges;
  mainScript?: string;
  templates?: string[];
}

/** Lint rule options */
export type LintRuleOptions = Pick<
  Rule,
  'name' | 'description' | 'packageChanges' | 'mainScript' | 'templates'
>;

/** Create a new lint rule */
export function createLintRule(options: LintRuleOptions): Rule {
  return { ...options, type: 'lint' };
}

/** Format rule options */
export type FormatRuleOptions = Pick<
  Rule,
  'name' | 'description' | 'packageChanges' | 'mainScript' | 'templates'
>;

/** Create a new format rule */
export function createFormatRule(options: FormatRuleOptions): Rule {
  return { ...options, type: 'format' };
}

/** Prettier rule options */
export type PrettierRuleOptions = Pick<
  FormatRuleOptions,
  'name' | 'packageChanges' | 'mainScript'
>;

/** Create a new prettier rule */
export function createPrettierRule(options: PrettierRuleOptions): Rule {
  return createFormatRule({
    name: `Prettier rule for ${options.name}`,
    description: `Prettier formatting for ${options.name}.`,
    packageChanges: options.packageChanges,
    mainScript: options.mainScript,
    templates: ['../templates/format/'],
  });
}
