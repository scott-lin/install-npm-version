import { FileSystem } from './FileSystem';
import { IOptions } from './IOptions';
import { Logger } from './Logger';
import { Settings } from './Settings';
import { Verbosity } from './Verbosity';
import childProcess  = require('child_process');
import fs = require('fs');
import npm = require('npm');
import path = require('path');

export default async function (npmPackage: string, options?: IOptions): Promise<void> {
    if (!npmPackage) {
        throw new Error('A NPM package to install must be specified. moment@2.22.2 or lodash@4.17.11 are examples.');
    }

    // Initialize settings and logging.
    //
    const settings = new Settings(npmPackage, options);
    const logger = new Logger(settings.Verbosity);

    logger.Write(`Settings: ${JSON.stringify(settings)}`, Verbosity.Debug);
    logger.Write(`Install Path: ${settings.InstallPath}`, Verbosity.Debug);

    // Bail when the install location already exists and the user has requested to not overwrite.
    //
    if (!settings.Overwrite && fs.existsSync(settings.InstallPath)) {
        logger.Write(`Install skipped because directory "${settings.InstallPath}" already exists and overwrite option is false.`, Verbosity.Default);
        return;
    }

    // Create a temporary directory where we will stage the NPM installation.
    //
    const temporaryStagingPath = fs.mkdtempSync(path.join(settings.NodeModulesPath, '.install-npm-version-temp-'));
    logger.Write(`Temporary staging directory created at "${temporaryStagingPath}".`, Verbosity.Debug);

    let error;

    try {
        InstallPackage(settings, logger, temporaryStagingPath);

        const packageName = await GetPackageName(settings, logger);

        FileSystem.CopyPackageDependencies(logger, packageName, temporaryStagingPath);

        if (FileSystem.RemoveDirectoryRecursively(settings.InstallPath)) {
            logger.Write(`Deleted existing directory at final installation path "${settings.InstallPath}".`, Verbosity.Debug);
        }

        const stagedPackagePath = path.join(temporaryStagingPath, 'node_modules', packageName);
        FileSystem.CopyDirectoryRecursively(stagedPackagePath, settings.InstallPath, false);

        logger.Write(`Installed ${settings.NpmPackage} to "${settings.InstallPath}".`, Verbosity.Default);
    } catch (err) {
        error = err;
    } finally {
        // Remove the temporary directory before we exit as applicable.
        //
        if (FileSystem.RemoveDirectoryRecursively(temporaryStagingPath)) {
            logger.Write(`Temporary staging directory deleted at "${temporaryStagingPath}".`, Verbosity.Debug);
        }

        if (error) {
            console.error(`Error encountered while installing ${settings.NpmPackage} NPM package.`)
            console.error(error.toString());
            process.exit(1);
        }
    }
}

async function GetPackageName(settings: Settings, logger: Logger): Promise<string> {
    return new Promise<string>(async (resolve, reject) => {
        // NPM must be loaded before the fetch package metadata function can be made.
        //
        await LoadNpm();

        const fetchPackageMetadata = require('npm/lib/fetch-package-metadata');
        fetchPackageMetadata(settings.NpmPackage, settings.WorkingDirectory, function (error: any, packageMetadata: any) {
            if (error) {
                reject(error);
            }

            logger.Write(`Package name is "${packageMetadata.name}".`, Verbosity.Debug);
            resolve(packageMetadata.name);
        });
    });
}

function InstallPackage(settings: Settings, logger: Logger, installPath: string) {
    // Before installing, make an effort to copy over and use any NPM config already present.
    //
    FileSystem.CopyNpmrcFile(settings, logger, installPath);

    // Initialize child process spawn options.
    //
    const options = {
        cwd: installPath,
        stdio: settings.Verbosity as Verbosity === Verbosity.Debug as Verbosity ? 'inherit' : 'ignore' as childProcess.StdioOptions
    };
    const command = process.platform === 'win32' ? 'npm.cmd' : 'npm';

    // Ensure there is a node_modules folder within the install directory. This will ensure NPM installs the package to
    // this location instead of migrating up to parent folders to find a package.json to use when installing. This would
    // lead to the package being installed in another location than our target here.
    //
    const nodeModulesPath = path.join(installPath, 'node_modules');
    if (!fs.existsSync(nodeModulesPath)) {
        fs.mkdirSync(nodeModulesPath);
    }

    logger.Write(`Spawning child process to install ${settings.NpmPackage} at "${installPath}".`, Verbosity.Debug);
    childProcess.spawnSync(command, ['install', settings.NpmPackage], options);
}

async function LoadNpm(): Promise<any> {
    return new Promise<any>(async (resolve, reject) => {
        npm.load(function (error, result) {
            if (error) {
                reject(error);
            }

            resolve(result);
        });
    });
}