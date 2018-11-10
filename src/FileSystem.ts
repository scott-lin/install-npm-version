import { Logger } from './Logger';
import { Settings } from './Settings';
import { Verbosity } from './Verbosity';
import fs = require('fs');
import path = require('path');

export class FileSystem {
    static CopyDirectoryRecursively(sourceDirectoryPath: string, destinationPath: string, isParent = true) {
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

    static CopyNpmrcFile(settings: Settings, logger: Logger, destinationPath: string) {
        if (settings.UseLocalNpmrcFile) {
            const npmrcFilePath = path.join(settings.WorkingDirectory, '.npmrc');

            if (fs.existsSync(npmrcFilePath)) {
                fs.copyFileSync(npmrcFilePath, destinationPath);
                logger.Write(`Copied local NPM config file "${npmrcFilePath}" to staging directory "${destinationPath}".`, Verbosity.Debug);
            }
        }
    }

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