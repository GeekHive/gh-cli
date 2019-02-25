"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var rules_1 = require("./rules");
/** JavaScript standard. */
exports.javaScript = {
    name: 'JavaScript',
    keywords: ['js', 'javascript', '.js', 'jsx', '.jsx'],
    description: 'JavaScript standard',
    rules: [
        rules_1.createPrettierRule({
            name: 'JavaScript',
            packageChanges: {
                devDependencies: ['prettier'],
                scripts: {
                    'js:format': 'prettier --write src/**/*.js'
                }
            },
            mainScript: 'js:format'
        }),
        rules_1.createLintRule({
            name: 'eslint',
            description: 'eslint lint rule for JavaScript',
            packageChanges: {
                devDependencies: ['eslint', '@geekhive/eslint-config-standard'],
                scripts: {
                    'js:lint': 'eslint src/**/*.js src/**/*.jsx'
                }
            },
            mainScript: 'js:lint',
            templates: ['../templates/lint/js']
        })
    ]
};
/** TypeScript standard */
exports.typeScript = {
    name: 'TypeScript',
    keywords: ['ts', 'typescript', '.ts', 'tsx', '.tsx'],
    description: 'TypeScript standard',
    rules: [
        rules_1.createPrettierRule({
            name: 'TypeScript',
            packageChanges: {
                devDependencies: ['prettier'],
                scripts: {
                    'ts:format': 'prettier --write src/**/*.ts src/**/*.tsx'
                }
            },
            mainScript: 'ts:format'
        }),
        rules_1.createLintRule({
            name: 'TSLint',
            description: 'TSLint lint rule for TypeScript',
            packageChanges: {
                devDependencies: ['tslint', '@geekhive/tslint-config-standard'],
                scripts: {
                    'ts:lint': 'tslint --project ./'
                }
            },
            mainScript: 'ts:lint',
            templates: ['../templates/lint/ts']
        })
    ]
};
/** SCSS standard */
exports.scss = {
    name: 'SCSS',
    keywords: ['scss', '.scss'],
    description: 'SCSS standard',
    rules: [
        rules_1.createPrettierRule({
            name: 'SCSS',
            packageChanges: {
                devDependencies: ['prettier'],
                scripts: {
                    'scss:format': 'prettier --write src/**/*.scss'
                }
            },
            mainScript: 'scss:format'
        }),
        rules_1.createLintRule({
            name: 'Stylelint',
            description: 'Stylelint lint rule for SCSS',
            packageChanges: {
                devDependencies: ['stylelint', '@geekhive/stylelint-config-standard'],
                scripts: {
                    'scss:lint': 'stylelint src/**/*.scss'
                }
            },
            mainScript: 'scss:lint',
            templates: ['../templates/lint/scss']
        })
    ]
};
/** Supported standards */
exports.standards = [exports.javaScript, exports.typeScript, exports.scss];
