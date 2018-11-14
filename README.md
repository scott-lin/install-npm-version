# install-npm-version

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