export enum Verbosity {
    /*
     * Intended to be used when logging messages that help with debugging, but should not be seen on routine executions.
     */
    Debug = 'Debug',

    /*
     * Intended to be used when logging messages that should be seen on routine executions.
     */
    Default = 'Default',

    /*
     * Do not use this verbosity when writing logging messages. This is intended to be used when constructing a Logger,
     * so it does not write any messages.
     */
    None = 'None'
}