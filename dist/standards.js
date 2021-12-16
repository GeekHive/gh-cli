'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.standards =
  exports.scss =
  exports.script =
  exports.toolingRule =
    void 0;
var rules_1 = require('./rules');
exports.toolingRule = {
  type: 'tooling',
  name: 'Tooling rule',
  description: 'Repository tooling',
  packageChanges: {
    devDependencies: ['husky@^4', 'lint-staged', 'concurrently'],
    scripts: {
      'lint-staged': 'lint-staged',
    },
  },
  mainScript: 'lint-staged',
  templates: ['../templates/tooling'],
};
/** JavaScript standard. */
exports.script = {
  name: 'Script',
  keywords: [
    'script',
    'scripts',
    'js',
    'javascript',
    '.js',
    'jsx',
    '.jsx',
    'ts',
    'typescript',
    '.ts',
    'tsx',
    '.tsx',
  ],
  description: 'Script standards',
  rules: [
    exports.toolingRule,
    (0, rules_1.createPrettierRule)({
      name: 'JavaScript',
      packageChanges: {
        devDependencies: ['prettier'],
        scripts: {
          // eslint-disable-next-line quotes, prettier/prettier
          'script:format': "prettier --write \"**/*.{js,jsx,ts,tsx}\"", // prettier-ignore
        },
      },
      mainScript: 'script:format',
    }),
    (0, rules_1.createLintRule)({
      name: 'eslint',
      description: 'eslint lint rule for scripts',
      packageChanges: {
        devDependencies: [
          'eslint',
          '@geekhive/eslint-config-standard',
          'https://github.com/geekhive/eslint-config-typescript',
        ],
        scripts: {
          // eslint-disable-next-line quotes, prettier/prettier
          'script:lint': "eslint --fix \"**/*.{js,jsx,ts,tsx}\"", // prettier-ignore
        },
      },
      mainScript: 'script:lint',
      templates: ['../templates/lint/script'],
    }),
  ],
};
/** SCSS standard */
exports.scss = {
  name: 'SCSS',
  keywords: ['scss', '.scss'],
  description: 'SCSS standards',
  rules: [
    exports.toolingRule,
    (0, rules_1.createPrettierRule)({
      name: 'SCSS',
      packageChanges: {
        devDependencies: ['prettier'],
        scripts: {
          'scss:format': 'prettier --write **/*.scss',
        },
      },
      mainScript: 'scss:format',
    }),
    (0, rules_1.createLintRule)({
      name: 'Stylelint',
      description: 'Stylelint lint rule for SCSS',
      packageChanges: {
        devDependencies: ['stylelint', '@geekhive/stylelint-config-standard'],
        scripts: {
          'scss:lint': 'stylelint **/*.scss',
        },
      },
      mainScript: 'scss:lint',
      templates: ['../templates/lint/scss'],
    }),
  ],
};
// /** TypeScript standard */
// export const typeScript: Standard = {
//   name: 'TypeScript',
//   keywords: ['ts', 'typescript', '.ts', 'tsx', '.tsx'],
//   description: 'TypeScript standard',
//   rules: [
//     createPrettierRule({
//       name: 'TypeScript',
//       packageChanges: {
//         devDependencies: ['prettier'],
//         scripts: {
//           'ts:format': 'prettier --write src/**/*.ts src/**/*.tsx'
//         }
//       },
//       mainScript: 'ts:format'
//     }),
//     createLintRule({
//       name: 'TSLint',
//       description: 'TSLint lint rule for TypeScript',
//       packageChanges: {
//         devDependencies: ['tslint', '@geekhive/tslint-config-standard'],
//         scripts: {
//           'ts:lint': 'tslint --project ./'
//         }
//       },
//       mainScript: 'ts:lint',
//       templates: ['../templates/lint/ts']
//     })
//   ]
// };
/** Supported standards */
exports.standards = [exports.script, exports.scss];
