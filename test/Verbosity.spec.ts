import { expect } from 'chai';
import { Verbosity } from '../src/Verbosity';

describe("Verbosity enum", () => {
    it('Should be defined with increasing values with respect to semantic naming', () => {
        expect(Verbosity.Debug < Verbosity.Default).to.be.true;
        expect(Verbosity.Default < Verbosity.None).to.be.true;
    });
});