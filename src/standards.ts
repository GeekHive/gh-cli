export interface Package {
  scripts: { [name: string]: string };
  devDependencies: string[];
  dependencies: string[];
}

interface Standard {
  name: string;
  keywords: string[];
  package: Package;
  templates: string[];
}

export const javaScript: Standard = {
  name: 'JavaScript',
  keywords: ['js', 'javascript', '.js', 'jsx', '.jsx'],
  package: {
    scripts: {
      'js:format': '',
      'js:lint': ''
    },
    devDependencies: ['eslint', '@geekhive/eslint-config-standard', 'prettier'],
    dependencies: []
  },
  templates: ['../templates/lint/js', '../templates/format/']
};

export const typeScript: Standard = {
  name: 'TypeScript',
  keywords: ['ts', 'typescript', '.ts', 'tsx', '.tsx'],
  package: {
    scripts: {
      'ts:format': '',
      'ts:lint': ''
    },
    devDependencies: ['tslint', '@geekhive/tslint-config-standard', 'prettier'],
    dependencies: []
  },
  templates: ['../templates/lint/ts', '../templates/format/']
};

export const scss: Standard = {
  name: 'SCSS',
  keywords: ['scss', '.scss'],
  package: {
    scripts: {
      'scss:format': '',
      'scss:lint': ''
    },
    devDependencies: ['stylelint', '@geekhive/stylelint-config-standard'],
    dependencies: []
  },
  templates: ['../templates/lint/scss', '../templates/format/']
};

export const standards: Standard[] = [javaScript, typeScript, scss];
