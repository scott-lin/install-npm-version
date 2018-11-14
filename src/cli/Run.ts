#!/usr/bin/env node

import { IOptions } from '../IOptions';
import { Verbosity } from '../Verbosity';
import fs = require('fs');
import installNpmVersion = require('../Install');
import minimist = require('minimist');
import path = require('path');

const args = minimist(
    process.argv.slice(2),
    {
        default: {
            debug: false,
            destination: undefined,
            help: false,
            overwrite: false,
            silent: false,
            useLocalNpmConfig: true,
            'working-directory': undefined
        },
        alias: {
            destination: 'd',
            help: 'h',
            overwrite: 'o',
            silent: 's',
            'working-directory': 'wd'
        }
    });

// Write command line usage when requested or bad input is supplied.
//
if (args.help) {
    process.stdout.write(GetUsageInstructions());
    process.exit(0);
}

if (args._.length !== 1) {
    process.stderr.write(GetUsageInstructions());
    process.exit(1);
}

if (args.debug && args.silent) {
    process.stderr.write(GetUsageInstructions());
    process.exit(1);
}

// Collect arguments to pass along to the installer.
//
const packageName = args._[0];
const installOptions: IOptions = {
    Destination: args.destination,
    Overwrite: args.overwrite,
    UseLocalNpmrcFile: args.useLocalNpmConfig,
    Verbosity: args.debug ? Verbosity.Debug : args.silent ? Verbosity.Silent : Verbosity.Default,
    WorkingDirectory: args['working-directory']
};

console.log(installOptions.WorkingDirectory);

installNpmVersion.default(packageName, installOptions)
    .then(function () {
        process.exit(0);
    })
    .catch(function () {
        process.exit(1);
    });

function GetUsageInstructions(): string {
    const readmeFilePath = path.join(__dirname, '..', '..', 'README.md');
    const readmeContent = fs.readFileSync(readmeFilePath, 'utf8');
    const matches = readmeContent.match(/```cli-usage\r?\n([\s\S]*?)```/);

    if (!matches || !matches.length) {
        throw new Error('Usage instructions could not be found within readme file.');
    }

    return matches[1];
}