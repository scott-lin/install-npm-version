import { IOptions } from "./IOptions";
import { Verbosity } from "./Verbosity";
import path = require('path');
import sanitizeFilename = require('sanitize-filename');

export class Settings {
    private readonly Destination: string;
    readonly NodeModulesPath: string;
    readonly NpmPackage: string;
    readonly Overwrite: boolean;
    readonly UseLocalNpmrcFile: boolean;
    readonly Verbosity: Verbosity;
    readonly WorkingDirectory: string;

    constructor(npmPackage: string, options?: IOptions) {
        if (!npmPackage) {
            throw new Error('A NPM package must be defined.');
        }

        this.Destination = (options && options.Destination) || sanitizeFilename(npmPackage, { replacement: '-' });
        this.NpmPackage = npmPackage;
        this.Overwrite = (options && options.Overwrite) === true;
        this.UseLocalNpmrcFile = options === undefined || options.UseLocalNpmrcFile;
        this.WorkingDirectory = (options && options.WorkingDirectory) || process.cwd();

        if (options && options.Verbosity) {
            switch (options && options.Verbosity.toLowerCase()) {
                case Verbosity.Debug.toLowerCase():
                    this.Verbosity = Verbosity.Debug;
                    break;
                case Verbosity.Default.toLowerCase():
                    this.Verbosity = Verbosity.Default;
                    break;
                case Verbosity.None.toLowerCase():
                    this.Verbosity = Verbosity.None;
                    break;
                default:
                    throw new Error(`Verbosity of "${options.Verbosity}" is not supported.`);
            }
        }
        else {
            this.Verbosity = Verbosity.Default;
        }

        this.NodeModulesPath = path.join(this.WorkingDirectory, 'node_modules');
    }

    get InstallPath(): string {
        return path.join(this.NodeModulesPath, this.Destination);
    }
}