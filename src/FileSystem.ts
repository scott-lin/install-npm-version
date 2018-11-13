import { Logger } from './Logger';
import { Settings } from './Settings';
import { Verbosity } from './Verbosity';
import fs = require('fs');
import path = require('path');

export class FileSystem {
    
    /*
     * Recursively reads files & directories from a source location and writes them to another location.
     *
     * @param sourceDirectoryPath Path where files & directories should be read.
     * @param destinationPath Path where files & directories should be written.
     * @param isParent True indicates items will be written to a newly created subfolder, with the same name as the source,
     *                 at the destination path. False indicates items will be written directly into the destination directory.
     */
    static CopyDirectoryRecursively(sourceDirectoryPath: string, destinationPath: string, isParent = true) {
        if (!sourceDirectoryPath) {
            throw new Error('Source directory path must be defined.');
        }

        if (!destinationPath) {
            throw new Error('Destination path must be defined.');
        }

        if (fs.lstatSync(sourceDirectoryPath).isDirectory()) {
            // Create a directory, with the same name as the source, at the destination root when it does not exist.
            //
            const copyToPath = isParent ? path.join(destinationPath, path.basename(sourceDirectoryPath)) : destinationPath;
            if (!fs.existsSync(copyToPath)) {
                fs.mkdirSync(copyToPath, { recursive: true });
            }

            // Recursively read and write files/directories.
            //
            fs.readdirSync(sourceDirectoryPath).forEach( function (item) {
                let itemPath = path.join(sourceDirectoryPath, item);
                
                if (fs.lstatSync(itemPath).isDirectory()) {
                    FileSystem.CopyDirectoryRecursively(itemPath, copyToPath);
                } else {
                    let fileCopyPath = copyToPath;
                    if (fs.existsSync(copyToPath) && fs.lstatSync(copyToPath).isDirectory()) {
                        fileCopyPath = path.join(copyToPath, path.basename(itemPath));
                    }

                    fs.writeFileSync(fileCopyPath, fs.readFileSync(itemPath));
                }
            } );
        }
    }

    /*
     * Copies any NPM config file found in the working directory to a destination when applicable based on settings. 
     *
     * @param settings Settings to control when to copy and from where.
     * @param logger Entity to use when writing logging messages.
     * @param destinationPath Path to copy to.
     */
    static CopyNpmrcFile(settings: Settings, logger: Logger, destinationPath: string) {
        if (settings.UseLocalNpmrcFile) {
            const npmrcFilePath = path.join(settings.WorkingDirectory, '.npmrc');

            if (fs.existsSync(npmrcFilePath)) {
                fs.copyFileSync(npmrcFilePath, destinationPath);
                logger.Write(`Copied local NPM config file "${npmrcFilePath}" to staging directory "${destinationPath}".`, Verbosity.Debug);
            }
        }
    }

    /*
     * Copies a module's dependencies into a "node_modules" subfolder.
     *
     * @param logger Entity to use when writing logging messages.
     * @param packageName Name of the package to copy dependencies for.
     * @param installPath Path to parent folder of "node_modules" where the package is installed.
     */
    static CopyPackageDependencies(logger: Logger, packageName: string, installPath: string) {
        const installationNodeModulesPath = path.join(installPath, 'node_modules');
        const packageNodeModulesPath = path.join(installationNodeModulesPath, packageName, 'node_modules');

        // Ensure directory we'll move the dependencies to exists.
        //
        if (!fs.existsSync(packageNodeModulesPath)) {
            fs.mkdirSync(packageNodeModulesPath);
        }
        
        const isDirectory = (source: string) => fs.lstatSync(source).isDirectory();
        const getDirectories = (source: string) => fs.readdirSync(source).map(name => path.join(source, name)).filter(isDirectory);
        
        logger.Write(`Copying ${packageName} package dependencies to "${packageNodeModulesPath}".`, Verbosity.Debug);
        
        getDirectories(installationNodeModulesPath)
            .filter(directoryPath => path.basename(directoryPath) !== packageName)
            .forEach(directoryPath => {
                const dependencyPackageName = path.basename(directoryPath);
                const sourcePath = path.join(installationNodeModulesPath, dependencyPackageName);

                logger.Write(`  Copying dependency "${dependencyPackageName}".`, Verbosity.Debug);
                FileSystem.CopyDirectoryRecursively(sourcePath, packageNodeModulesPath);
            });
    }

    /*
     * Deletes a directory and all its contents.
     *
     * @param directoryPath Path of directory to delete.
     *
     * @returns True if deletion occurred. Otherwise, false.
     */
    static RemoveDirectoryRecursively(directoryPath: string): boolean {
        if (fs.existsSync(directoryPath) && fs.lstatSync(directoryPath).isDirectory()) {
            fs.readdirSync(directoryPath).forEach(function(item) {
                var childPath = path.join(directoryPath, item);

                if (fs.lstatSync(childPath).isDirectory()) {
                    FileSystem.RemoveDirectoryRecursively(childPath);
                } else {
                    fs.unlinkSync(childPath);
                }
            });

            fs.rmdirSync(directoryPath);

            return true;
        }

        return false;
    };
}