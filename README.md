# install-npm-version

[![npm-version][npm-version-badge]][npm-version-href]
[![build-status][build-status-badge]][build-status-href]
[![dependencies][dependencies-badge]][dependencies-href]
[![dev-dependencies][dev-dependencies-badge]][dev-dependencies-href]

Install multiple versions of a node module to versioned or custom directories.

## Command Line Usage

### Install

```
npm install -g install-npm-version
```

### How To

```cli-usage
Syntax:

  inv <package> [options...]
  install-npm-version <package> [options...]

Required:

  package
    Package to be installed, which is passed through to "npm install <package>".

Optional:

  --destination, --d
    Directory path relative to node_modules/ of the [working-directory] to install package to.
    Default: sanitized <package>

  --overwrite, --o
    Overwrite any existing package at [destination] location.
    Default: false

  --silent, --s
    Suppress informational messages, but error messages will still be shown.
    Default: false

  --debug
    Shows detailed messages about execution process.
    Default: false

  --working-directory, --wd
    Directory that contains node_modules/ folder to install package to. If no node_modules/ folder exists, one will be created.
    Default: current directory

  --useLocalNpmConfig
    Uses any existing NPM configuration within [working-directory] when installing package.

  --help, --h
    Shows these how-to instructions.
```

### Examples

```examples
> inv chalk@2.4.0
# installs chalk@2.4.0 to node_modules/chalk@2.4.0/

> inv chalk@2.4.0 --destination some/path/chalk
# installs chalk@2.4.0 to node_modules/some/path/chalk/
```

## Programmatic Usage

### Install
```
npm install install-npm-version --save-dev
```

### Examples

#### Install to versioned (default) directory

```typescript
import installNpmVersion = require('install-npm-version');

installNpmVersion('chalk@2.4.0');
// installs chalk@2.4.0 to node_modules/chalk@2.4.0/

installNpmVersion('chalk@2.4.1');
// installs chalk@2.4.1 to node_modules/chalk@2.4.1/
```

#### Install to custom directory

```typescript
import installNpmVersion = require('install-npm-version');

installNpmVersion('chalk@2.4.0', { 'Destination': 'some/path/chalk' });
// installs chalk@2.4.0 to node_modules/some/path/chalk/
```

#### Install with silent or noisy standard output

```typescript
import installNpmVersion = require('install-npm-version');

installNpmVersion('chalk@2.4.0', { 'Verbosity': 'Silent' }); // silent
installNpmVersion('chalk@2.4.0', { 'Verbosity': 'Debug' }); // noisy
```

#### Overwrite an existing installation

```typescript
import installNpmVersion = require('install-npm-version');

installNpmVersion('chalk@2.4.0', { 'Destination': 'mydir' });
// installs chalk@2.4.0 to node_modules/mydir/

installNpmVersion('chalk@2.4.1', { 'Destination': 'mydir' });
// does not install chalk@2.4.1 since node_modules/mydir/ already exists

installNpmVersion('chalk@2.4.1', { 'Destination': 'mydir', 'Overwrite': true });
// installs chalk@2.4.1 to node_modules/mydir/ by overwriting existing install
```

[npm-version-badge]: https://img.shields.io/npm/v/install-npm-version.svg?style=flat-square
[npm-version-href]: https://www.npmjs.com/package/install-npm-version

[build-status-badge]: https://img.shields.io/travis/scott-lin/install-npm-version/master.svg?style=flat-square
[build-status-href]: https://travis-ci.org/scott-lin/install-npm-version/branches

[dependencies-badge]: https://img.shields.io/david/scott-lin/install-npm-version.svg?style=flat-square
[dependencies-href]: https://david-dm.org/scott-lin/install-npm-version#info=dependencies

[dev-dependencies-badge]: https://img.shields.io/david/dev/scott-lin/install-npm-version.svg?style=flat-square
[dev-dependencies-href]: https://david-dm.org/scott-lin/install-npm-version#info=devDependencies