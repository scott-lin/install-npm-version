# install-npm-version

Install multiple versions of a node module to versioned or custom directories.

## Programmatic Usage

### Install
```
npm install install-npm-version --save-dev
```

### Examples

#### Install to versioned (default) directory

```typescript
import installNpmVersion = require('install-npm-version');

installNpmVersion('chalk@2.4.0'); // installs chalk@2.4.0 to node_modules/chalk@2.4.0
installNpmVersion('chalk@2.4.1'); // installs chalk@2.4.1 to node_modules/chalk@2.4.1
```

#### Install to custom directory

```typescript
import installNpmVersion = require('install-npm-version');

installNpmVersion('chalk@2.4.0', { 'Destination': 'some/path/chalk' }); // installs chalk@2.4.0 to node_modules/some/path/chalk
```

#### Install with silent or chatty standard output

```typescript
import installNpmVersion = require('install-npm-version');

installNpmVersion('chalk@2.4.0', { 'Verbosity': 'None' }); // silent
installNpmVersion('chalk@2.4.0', { 'Verbosity': 'Debug' }); // chatty with details for debugging
```