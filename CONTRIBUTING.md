## How to Build, Test, Package and Publish

### Prerequisites

- Install the gulp command line via `npm install -g gulp-cli`

### Beta Package

1. Bump the `version` within `package.json` and designate it as beta by appending `-beta.0`
1. Run `gulp` at the repo root to build source, run unit tests, and stage package folder. Ensure all unit tests pass before moving on.
1. Change directory to `package` folder within repo root
1. Publish the beta package via `npm publish --tag beta`
1. Install the beta package globally via `npm install -g install-npm-version@<beta-version>`
1. Test the beta version:
   1. Run `inv chalk@2.4.0` and validate `node_modules/chalk@2.4.0` presence with version 2.4.0
   1. Run `inv chalk@2.4.0 --destination some/path/chalk` and validate `node_modules/some/path/chalk` presence with version 2.4.0
1. Uninstall the beta package via `npm uninstall -g install-npm-version`

### Release Package

1. Ensure the release `version` is set within `package.json`
1. Run `gulp` at the repo root
1. Change directory to `package` folder within repo root
1. Publish via `npm publish`
