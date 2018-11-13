import { Verbosity } from "./Verbosity";

export class Logger {
    readonly MinimumVerbosity: Verbosity;

    constructor(minimumVerbosity: Verbosity) {
        this.MinimumVerbosity = minimumVerbosity;
    }

    /*
     * Writes a message to standard output followed by a line break.
     *
     * @param message Message to write.
     * @param verbosity Verbosity of the message.
     */
    Write(message: string, verbosity: Verbosity): void {
        if (verbosity >= this.MinimumVerbosity && verbosity !== Verbosity.None) {
            process.stdout.write(`${message}\n`);
        }
    }

    /*
     * Writes a message to standard error followed by a line break.
     *
     * @param message Message to write.
     */
    WriteError(message: string): void {
        process.stderr.write(`${message}\n`);
    }
}