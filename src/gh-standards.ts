#!/usr/bin/env node

import program from 'commander';
import install from 'install-packages';
import path from 'path';
import fs from 'fs-extra';
import * as R from 'ramda';

const ERROR_NO_TYPES = 'At least one valid type is required.';
const ERROR_INVALID_TYPE = (type: string) => `Type ${type} is not supported.`;

interface Package {
	scripts: { [name: string]: string };
	devDependencies: string[];
	dependencies: string[];
}

interface Standard {
	name: string;
	keywords: string[];
	packageJson: Package;
	templates: string[];
}

const javaScript: Standard = {
	name: 'JavaScript',
	keywords: ['js', 'javascript', '.js', 'jsx', '.jsx'],
	packageJson: {
		scripts: {
			'js:format': '',
			'js:lint': ''
		},
		devDependencies: [
			'eslint', 
			'@geekhive/eslint-config-standard', 
			'prettier'
		],
		dependencies: [],
	},
	templates: [
		'../templates/lint/js',
		'../templates/format/'
	]
};

const typeScript: Standard = {
	name: 'TypeScript',
	keywords: ['ts', 'typescript', '.ts', 'tsx', '.tsx'],
	packageJson: {
		scripts: {
			'ts:format': '',
			'ts:lint': ''
		},
		devDependencies: [
			'tslint', 
			'@geekhive/tslint-config-standard', 
			'prettier'
		],
		dependencies: [],
	},
	templates: [
		'../templates/lint/ts',
		'../templates/format/'
	]
};

const scss: Standard = {
	name: 'SCSS',
	keywords: ['scss', '.scss'],
	packageJson: {
		scripts: {
			'scss:format': '',
			'scss:lint': ''
		},
		devDependencies: [
			'stylelint', 
			'@geekhive/stylelint-config-standard'
		],
		dependencies: []
	},
	templates: [
		'../templates/lint/scss',
		'../templates/format/'
	]
}

const standards: Standard[] = [javaScript, typeScript, scss];

function start() {
	program.parse(process.argv);
	if (!program.args.length) {
    console.error(ERROR_NO_TYPES);
    process.exit(1);
  }
	processTypes(program.args);
}

function mergeStandards(...standards: Standard[]): Standard {
	return {
		name: standards.map(s => s.name).join(', '),
		keywords: R.uniq(standards.map(s => s.keywords).reduce((p, c) => [...p, ...c])),
		packageJson: {
			scripts: standards.map(s => s.packageJson.scripts).reduce((p, c) => R.merge(p, c)),
			devDependencies: R.uniq(standards.map(s => s.packageJson.devDependencies).reduce((p, c) => [...p, ...c])),
			dependencies: R.uniq(standards.map(s => s.packageJson.dependencies).reduce((p, c) => [...p, ...c])),
		},
		templates: R.uniq(standards.map(s => s.templates).reduce((p, c) => [...p, ...c]))
	}
}

async function processStandard(standard: Standard) {
	await install({ packages: standard.packageJson.dependencies });
	await install({ packages: standard.packageJson.devDependencies, saveDev: true });
	standard.templates.forEach(template => 
		fs.copy(
			path.join(path.dirname(require.resolve('./gh')), template),  
			process.cwd()
		)
	);
	// @TODO: package.json
}

async function processTypes(types: string[]) {
	const selected = standards.filter(standard => 
		types
			// string[] -> boolean[] - whether any keyword of this standard matched the current type
			.map(type => standard.keywords.reduce((p, c) => p || c === type, false))
			// boolean[] -> boolean - whether this standard matched any type
			.reduce((p, c) => p || c, false)
	);
	return processStandard(mergeStandards(...selected));
}

start();
