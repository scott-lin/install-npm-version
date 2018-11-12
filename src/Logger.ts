import { Verbosity } from "./Verbosity";

export class Logger {
    readonly MinimumVerbosity: Verbosity;

    constructor(minimumVerbosity: Verbosity) {
        this.MinimumVerbosity = minimumVerbosity;
    }

    Write(message: string, verbosity: Verbosity, ...optionalParams: any[]): void {
        if (verbosity >= this.MinimumVerbosity && verbosity !== Verbosity.None) {
            console.log(message, ...optionalParams);
        }
    }
}