import { expect } from 'chai';
import { IOptions } from '../src/IOptions';
import { Settings } from '../src/Settings';
import { Verbosity } from '../src/Verbosity';
import path = require('path');
import sanitizeFilename = require('sanitize-filename');

describe("Settings", () => {
    describe('Constructor', () => {
        it('Should return object initialized with NPM package name and default settings', () => {
            // Arrange
            //
            const npmPackage = 'install-npm-version@1.0.0';

            // Act
            //
            const settings = new Settings(npmPackage);

            // Assert
            //
            expect(settings).to.exist;
            expect(settings.InstallPath).to.equal(path.join(settings.NodeModulesPath, sanitizeFilename(npmPackage)));
            expect(settings.NodeModulesPath).to.equal(path.join(process.cwd(), 'node_modules'));
            expect(settings.NpmPackage).to.equal(npmPackage);
            expect(settings.Overwrite).to.be.false;
            expect(settings.UseLocalNpmrcFile).to.be.true;
            expect(settings.Verbosity).to.equal(Verbosity.Default);
        });

        it('Should return object initialized with NPM package name and options passed', () => {
            // Arrange
            //
            const npmPackage = 'install-npm-version@1.0.0';
            const options: IOptions = {
                Destination: 'installFolder',
                Overwrite: true,
                UseLocalNpmrcFile: false,
                Verbosity: 'sileNt',
                WorkingDirectory: './some/path',
            };

            // Act
            //
            const settings = new Settings(npmPackage, options);

            // Assert
            //
            expect(settings).to.exist;
            expect(settings.InstallPath).to.equal(path.join(options.WorkingDirectory, 'node_modules', options.Destination));
            expect(settings.NodeModulesPath).to.equal(path.join(options.WorkingDirectory, 'node_modules'));
            expect(settings.NpmPackage).to.equal(npmPackage);
            expect(settings.Overwrite).to.be.true;
            expect(settings.UseLocalNpmrcFile).to.be.false;
            expect(settings.Verbosity).to.equal(Verbosity.Silent);
            expect(settings.WorkingDirectory).to.equal(options.WorkingDirectory);
        });
    });
});