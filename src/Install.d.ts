// Type definitions for install-npm-version
// Project: https://github.com/scott-lin/install-npm-version
// Definitions by: Scott Lin <https://github.com/scott-lin>

import { IOptions } from './IOptions';

export { IOptions } from './IOptions';
export declare function Install(npmPackage: string, options?: IOptions): Promise<void>;