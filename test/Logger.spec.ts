import { expect } from 'chai';
import { Logger } from '../src/Logger';
import { Verbosity } from '../src/Verbosity';

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
});