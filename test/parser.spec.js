const { expect } = require('chai');
const parser = require('../src/parser');

describe('Parser', function () {

    describe('getAttributeRegExp', function () {
        it('should return a regular expression', function () {
            const regExp = parser.getAttributeRegExp();

            expect(regExp).to.match(/bd-/);
        });
    });

    describe('getInterpolationRegExp', function () {
        it('should return a regular expression', function () {
            const regExp = parser.getInterpolationRegExp();

            expect(regExp).to.match(/{{(.*?)}}/);
        });
    });

    describe('parseKeypath', function () {
        const keypath = 'user.city';
        const target = {
            user: {
                city: 'Berlin'
            }
        };
        const parsing = parser.parseKeypath({ keypath, target });

        it('should return an object', function () {
            expect(parsing).to.be.an('object');
            expect(parsing).to.have.property('key', 'city');
            expect(parsing).to.have.deep.property('obj', { city: 'Berlin' });
            expect(parsing).to.have.property('val', 'Berlin');
        });
    });
});