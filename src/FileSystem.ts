import { Logger } from './Logger';
import { Settings } from './Settings';
import { Verbosity } from './Verbosity';
import fs = require('fs');
import path = require('path');

export class FileSystem {
    /*
     * Copies files from one location to another by reading source paths from the given array and writing to the
     * corresponding indexed path in the destination array.
     *
     * @param sourceFilePaths Paths of files to read.
     * @param destinationFilePaths Paths of files to write.
     */
    static CopyFiles(sourceFilePaths: string[], destinationFilePaths: string[]): void {
        if (!sourceFilePaths) {
            throw new Error('Source file paths must be defined.');
        }

        if (!destinationFilePaths) {
            throw new Error('Destination file paths must be defined.');
        }

        if (sourceFilePaths.length !== destinationFilePaths.length) {
            throw new Error('Source and destination file path count must be equal.');
        }

        // Find the set of directory paths we should create before copying.
        //
        const destinationDirectoryPaths =
            [...new Set(destinationFilePaths.map((filePath) => path.dirname(filePath)))]
                .sort()
                .filter((directoryPath, index, array) => {
                    if (index + 1 < array.length) {
                        var next = array[index + 1];

                        return !next.startsWith(directoryPath)
                            || (directoryPath.length < next.length && !(next[directoryPath.length] == '/' || next[directoryPath.length] == '\\'));
                    }

                    return directoryPath;
                });

        // Create all directories to copy files into.
        //
        destinationDirectoryPaths.forEach((directoryPath) => {
            if (!fs.existsSync(directoryPath)) {
                fs.mkdirSync(directoryPath, { recursive: true });
            }
        });

        // Copy each file to its destination.
        //
        for (let i = 0; i < sourceFilePaths.length; i++) {
            fs.copyFileSync(sourceFilePaths[i], destinationFilePaths[i]);
        }
    }

    /*
     * Copies any NPM config file found in the working directory to a destination when applicable based on settings.
     *
     * @param settings Settings to control when to copy and from where.
     * @param logger Entity to use when writing logging messages.
     * @param destinationPath Path to copy to.
     */
    static CopyNpmrcFile(settings: Settings, logger: Logger, destinationPath: string): void {
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
    static CopyPackageDependencies(logger: Logger, packageName: string, installPath: string): void {
        const installationNodeModulesPath = path.join(installPath, 'node_modules');
        const packageNodeModulesPath = path.join(installationNodeModulesPath, packageName, 'node_modules');

        // Ensure directory we'll move the dependencies to exists.
        //
        if (!fs.existsSync(packageNodeModulesPath)) {
            fs.mkdirSync(packageNodeModulesPath);
        }

        logger.Write(`Copying ${packageName} package dependencies to "${packageNodeModulesPath}".`, Verbosity.Debug);

        const sourceFilePaths = FileSystem.EnumerateFilesRecursively(installationNodeModulesPath)
            .filter((filePath) => !filePath.startsWith(path.join(installationNodeModulesPath, packageName)));

        const destinationFilePaths = sourceFilePaths
            .map((filePath) => path.join(packageNodeModulesPath, filePath.split(installationNodeModulesPath).pop() as string));

        FileSystem.CopyFiles(sourceFilePaths, destinationFilePaths);
    }

    static EnumerateFilesRecursively(directoryPath: string) {
        let results: string[] = [];
        const list = fs.readdirSync(directoryPath);

        list.forEach(function (file) {
            file = path.join(directoryPath, file);
            const stat = fs.statSync(file);

            if (stat && stat.isDirectory()) {
                results = results.concat(FileSystem.EnumerateFilesRecursively(file));
            } else {
                results.push(file);
            }
        });

        return results;
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
            fs.readdirSync(directoryPath).forEach(function (item) {
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