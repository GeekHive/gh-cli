# gh-cli

A tool for easily installing front end language lint and formatting standards to projects.

## Commands

| Command                   | Description                               |
| ------------------------- | ----------------------------------------- |
| `standards [keywords...]` | Add standards for given standard keywords |

## Standards

| Standard   | Keyword | Standard                                                                   | Lint Tool              | Formatting Tool      |
| ---------- | ------- | -------------------------------------------------------------------------- | ---------------------- | -------------------- |
| JavaScript | `js`    | [@geekhive/eslint-config-standard][@geekhive/eslint-config-standard]       | [ESlint][eslint]       | [Prettier][prettier] |
| TypeScript | `ts`    | [@geekhive/tslint-config-standard][@geekhive/tslint-config-standard]       | [TSLint][tslint]       | [Prettier][prettier] |
| SCSS       | `scss`  | [@geekhive/stylelint-config-standard][@geekhive/stylelint-config-standard] | [stylelint][stylelint] | [Prettier][prettier] |

## Usage

Run with [`npx`][npx]:

```sh
# Run the CLI tool, installing JavaScript, TypeScript, and SCSS standards
npx @geekhive/gh-cli standards js ts scss
```

Install the CLI tool globally and use:

```sh
# Install globally with npm
npm install -g @geekhive/gh-cli

# Install globally with yarn
yarn add -g @geekhive/gh-cli

# Run the CLI tool, installing JavaScript, TypeScript, and SCSS standards
gh standards js ts scss
```

## Development

_Make sure to commit the build files as this allows running npx directly against a branch._

Run the watch task:

```sh
yarn run dev
```

Run a build:

```sh
yarn run build
```

Execute the CLI tool:

```sh
node dist/gh.js standards js ts scss
```

Debug the CLI tool:

```sh
node --inspect-brk dist/gh.js standards js ts scss
```

[npx]: https://www.npmjs.com/package/npx
[eslint]: https://eslint.org
[@geekhive/eslint-config-standard]: https://github.com/GeekHive/eslint-config-standard
[tslint]: https://palantir.github.io/tslint/
[@geekhive/tslint-config-standard]: https://github.com/GeekHive/tslint-config-standard
[stylelint]: https://stylelint.io
[@geekhive/stylelint-config-standard]: https://github.com/GeekHive/stylelint-config-standard
[prettier]: https://prettier.io
