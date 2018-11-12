import { Verbosity } from "./Verbosity";

export class Logger {
    readonly MinimumVerbosity: Verbosity;

    constructor(minimumVerbosity: Verbosity) {
        this.MinimumVerbosity = minimumVerbosity;
    }

    Write(message: string, verbosity: Verbosity): void {
        if (verbosity >= this.MinimumVerbosity && verbosity !== Verbosity.None) {
            process.stdout.write(`${message}\n`);
        }
    }

    WriteError(message: string): void {
        process.stderr.write(`${message}\n`);
    }
}