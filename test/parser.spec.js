const {
    expect
} = require('chai');
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

    describe('parseAttributes', function () {
        const attributes = [{
            name: 'bd-text',
            value: 'user.name'
        }, {
            name: 'bd-model',
            value: 'user.city'
        }];
        const regExp = new RegExp(/bd-/);
        const parsing = parser.parseAttributes(attributes, regExp);

        it('should return an array', function () {
            expect(parsing).to.be.an('array');
        });

        it('should return an array of two objects', function () {
            expect(parsing).to.have.lengthOf(2);
            expect(parsing[0]).to.be.an('object');
            expect(parsing[1]).to.be.an('object');
        });
    });

    describe('parseKeypath', function () {
        const keypath = 'user.city';
        const target = {
            user: {
                city: 'Berlin'
            }
        };
        const parsing = parser.parseKeypath({
            keypath,
            target
        });

        it('should return an object', function () {
            expect(parsing).to.be.an('object');
            expect(parsing).to.have.property('key', 'city');
            expect(parsing).to.have.deep.property('obj', {
                city: 'Berlin'
            });
            expect(parsing).to.have.property('val', 'Berlin');
        });
    });
});