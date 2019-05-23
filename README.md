# gh-cli

A tool for easily installing front end language lint and formatting standards and accessibility tools  to projects.

## Commands

| Command                   | Alias      | Description                               |
| ------------------------- | ---------- | ----------------------------------------- |
| `standards [keywords...]` | N/A        | Add standards for given standard keywords |
| `accessibility [keywords...]` | `a11y [keywords...]` | Add accessibility tools for given accessibility tool keywords. If no keywords are provided, all supported tools are installed. |

## Standards

| Standard   | Keyword | Standard                                                                   | Lint Tool              | Formatting Tool      |
| ---------- | ------- | -------------------------------------------------------------------------- | ---------------------- | -------------------- |
| JavaScript | `js`    | [@geekhive/eslint-config-standard][@geekhive/eslint-config-standard]       | [ESlint][eslint]       | [Prettier][prettier] |
| TypeScript | `ts`    | [@geekhive/tslint-config-standard][@geekhive/tslint-config-standard]       | [TSLint][tslint]       | [Prettier][prettier] |
| SCSS       | `scss`  | [@geekhive/stylelint-config-standard][@geekhive/stylelint-config-standard] | [stylelint][stylelint] | [Prettier][prettier] |

## Accessibility

| Accessibility   | Keyword | Accessibility Tool  |
| --------------- | ------- | ------------------- |
| aXe | `axe`    | [axe-cli][axe]       |
| pa11y | `pa11y`    | [pa11y][pa11y]       |
| lighthouse       | `lighthouse`  | [lighthouse][lighthouse] |


## Usage

### Run with [`npx`][npx]:

```sh
# Run the CLI tool, installing JavaScript, TypeScript, and SCSS standards
npx @geekhive/gh-cli standards js ts scss

# Run the CLI tool, installing axe-cli, pa11y, and lighthouse accessibility tools
npx @geekhive/gh-cli accessibility axe pa11y lighthouse
```

### Install the CLI tool globally:

```sh
# Install globally with npm
npm install -g @geekhive/gh-cli

# Install globally with yarn
yarn add -g @geekhive/gh-cli
```

### Run CLI tool after global installation:

#### Standards

```sh
# Run the CLI tool, installing JavaScript, TypeScript, and SCSS standards
gh standards js ts scss
```

#### Accessibility

Use `accessibility` or `a11y` command

```sh
# Run the CLI tool, installing support for pa11y
gh accessibility pa11y 

# Run the CLI tool, installing support for pa11y and lighthouse
gh a11y pa11y lighthouse

# Run the CLI tool, installing install support for all supported accessibility tools
gh a11y
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

Or:

```sh
node dist/gh.js accessibility axe pa11y lighthouse
```

Debug the CLI tool:

```sh
node --inspect-brk dist/gh.js standards js ts scss
```

Or:

```sh
node --inspect-brk dist/gh.js accessibility axe pa11y lighthouse
```

[npx]: https://www.npmjs.com/package/npx
[eslint]: https://eslint.org
[@geekhive/eslint-config-standard]: https://github.com/GeekHive/eslint-config-standard
[tslint]: https://palantir.github.io/tslint/
[@geekhive/tslint-config-standard]: https://github.com/GeekHive/tslint-config-standard
[stylelint]: https://stylelint.io
[@geekhive/stylelint-config-standard]: https://github.com/GeekHive/stylelint-config-standard
[prettier]: https://prettier.io
[axe]: https://github.com/dequelabs/axe-cli
[pa11y]: https://github.com/pa11y/pa11y
[lighthouse]: https://github.com/GoogleChrome/lighthouse#readme
