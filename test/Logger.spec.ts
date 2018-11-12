import { expect } from 'chai';
import { Logger } from '../src/Logger';
import { Verbosity } from '../src/Verbosity';
import chai = require('chai');
import spies = require('chai-spies');

chai.use(spies);

describe("Logger", () => {
    describe('Constructor', () => {
        it('Should return initialized object', () => {
            // Arrange
            //
            const minimumVerbosity = Verbosity.Debug;

            // Act
            //
            const logger = new Logger(minimumVerbosity);

            // Assert
            //
            expect(logger).to.exist;
            expect(logger.MinimumVerbosity).to.equal(minimumVerbosity);
        });
    });

    describe('Write', () => {
        let consoleLogFunction: any;
        const debugMessage = `Hello from ${Verbosity.Debug} verbosity.`;
        const defaultMessage = `Hello from ${Verbosity.Default} verbosity.`;
        const noneMessage = `Hello from ${Verbosity.None} verbosity.`;

        beforeEach(function () {
            consoleLogFunction = console.log;
        });

        afterEach(function () {
            console.log = consoleLogFunction;
        });

        it(`Should write message when verbosity satisfies logger's minimum verbosity of "${Verbosity.Debug}"`, () => {
            // Arrange
            //
            chai.spy.on(console, 'log', function () {});
            const logger = new Logger(Verbosity.Debug);

            // Act
            //
            logger.Write(debugMessage, Verbosity.Debug);
            logger.Write(defaultMessage, Verbosity.Default);
            logger.Write(noneMessage, Verbosity.None);

            // Assert
            //
            expect(console.log).to.have.been.called.exactly(2);
            expect(console.log).to.have.been.first.called.with.exactly(debugMessage);
            expect(console.log).to.have.been.second.called.with.exactly(defaultMessage);
            expect(console.log).to.have.not.been.called.with.exactly(noneMessage);
        });

        it(`Should write message when verbosity satisfies logger's minimum verbosity of "${Verbosity.Default}"`, () => {
            // Arrange
            //
            chai.spy.on(console, 'log', function () {});
            const logger = new Logger(Verbosity.Default);

            // Act
            //
            logger.Write(debugMessage, Verbosity.Debug);
            logger.Write(defaultMessage, Verbosity.Default);
            logger.Write(noneMessage, Verbosity.None);

            // Assert
            //
            expect(console.log).to.have.been.called.exactly(1);
            expect(console.log).to.have.not.been.called.with.exactly(debugMessage);
            expect(console.log).to.have.been.first.called.with.exactly(defaultMessage);
            expect(console.log).to.have.not.been.called.with.exactly(noneMessage);
        });

        it(`Should write message when verbosity satisfies logger's minimum verbosity of "${Verbosity.None}"`, () => {
            // Arrange
            //
            chai.spy.on(console, 'log', function () {});
            const logger = new Logger(Verbosity.None);

            // Act
            //
            logger.Write(debugMessage, Verbosity.Debug);
            logger.Write(defaultMessage, Verbosity.Default);
            logger.Write(noneMessage, Verbosity.None);

            // Assert
            //
            expect(console.log).to.have.been.called.exactly(0);
            expect(console.log).to.have.not.been.called.with.exactly(debugMessage);
            expect(console.log).to.have.not.been.called.with.exactly(defaultMessage);
            expect(console.log).to.have.not.been.called.with.exactly(noneMessage);
        });
    });
});