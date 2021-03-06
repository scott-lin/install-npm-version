import { FileSystem } from './FileSystem';
import { IOptions } from './IOptions';
import { Logger } from './Logger';
import { Npm } from './Npm';
import { Settings } from './Settings';
import { Verbosity } from './Verbosity';
import fs = require('fs');
import path = require('path');

/*
 * Installs a NPM package with optional settings.
 *
 * @param npmPackage NPM package to install.
 * @param options Optional settings to control the installation.
 */
export async function Install(npmPackage: string, options?: IOptions): Promise<void> {
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

    // Ensure the node_modules path exists.
    //
    if (!fs.existsSync(settings.NodeModulesPath)) {
        fs.mkdirSync(settings.NodeModulesPath, { recursive: true });
        logger.Write(`Node modules directory created at "${settings.NodeModulesPath}".`, Verbosity.Debug);
    }

    // Create a temporary directory where we will stage the NPM installation.
    //
    const temporaryStagingPath = fs.mkdtempSync(path.join(settings.NodeModulesPath, '.install-npm-version-temp-'));
    logger.Write(`Temporary staging directory created at "${temporaryStagingPath}".`, Verbosity.Debug);

    let error;

    try {
        // Install the package to the staging location.
        //
        Npm.InstallPackage(settings, logger, temporaryStagingPath);

        // Fetch the package's official name and use it to copy dependencies into the staged package folder.
        //
        const packageName = await Npm.GetPackageName(settings, logger);
        FileSystem.CopyPackageDependencies(logger, packageName, temporaryStagingPath);

        // Ensure the final installation path is cleared.
        //
        if (FileSystem.RemoveDirectoryRecursively(settings.InstallPath)) {
            logger.Write(`Deleted existing directory at final installation path "${settings.InstallPath}".`, Verbosity.Debug);
        }

        // Copy staged package folder to its final destination.
        //
        const stagedPackagePath = path.join(temporaryStagingPath, 'node_modules', packageName);
        const stagedFilePaths = FileSystem.EnumerateFilesRecursively(stagedPackagePath);
        const finalizedFilePaths = stagedFilePaths
            .map((filePath) => path.join(settings.InstallPath, filePath.split(stagedPackagePath).pop() as string));
            
        logger.Write(`Copying staged package "${stagedPackagePath}" to final destination "${settings.InstallPath}".`, Verbosity.Debug);
        FileSystem.CopyFiles(stagedFilePaths, finalizedFilePaths);

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
            logger.WriteError(`Error encountered while installing ${settings.NpmPackage} NPM package.`)
            logger.WriteError(error.toString());
            process.exit(1);
        }
    }
}