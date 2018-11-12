import { FileSystem } from './FileSystem';
import { Logger } from './Logger';
import { Settings } from './Settings';
import { Verbosity } from './Verbosity';
import childProcess  = require('child_process');
import fs = require('fs');
import npm = require('npm');
import path = require('path');

export class Npm {
    static async GetPackageName(settings: Settings, logger: Logger): Promise<string> {
        return new Promise<string>(async (resolve, reject) => {
            // NPM must be loaded before the fetch package metadata function can be made.
            //
            await Npm.LoadNpm();

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

    static InstallPackage(settings: Settings, logger: Logger, installPath: string) {
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

    private static async LoadNpm(): Promise<any> {
        return new Promise<any>(async (resolve, reject) => {
            npm.load(function (error, result) {
                if (error) {
                    reject(error);
                }

                resolve(result);
            });
        });
    }
}