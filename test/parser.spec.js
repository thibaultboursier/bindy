const {
    expect
} = require('chai');
const parser = require('../src/parser');

describe('Parser', () => {

    describe('#getAttributeRegExp()', () => {
        it('should return a regular expression', () => {
            const regExp = parser.getAttributeRegExp();

            expect(regExp).to.match(/bd-/);
        });
    });

    describe('#getInterpolationRegExp()', () => {
        it('should return a regular expression', () => {
            const regExp = parser.getInterpolationRegExp();

            expect(regExp).to.match(/{{(.*?)}}/);
        });
    });

    describe('#parseAttributes()', () => {
        const attributes = [{
            name: 'bd-text',
            value: 'user.name'
        }, {
            name: 'bd-model',
            value: 'user.city'
        }];
        const regExp = new RegExp(/bd-/);
        const parsing = parser.parseAttributes(attributes, regExp);

        it('should return an array of 2 objects containing parsing result', () => {
            expect(parsing).to.be.an('array');
            expect(parsing).to.have.lengthOf(2);
            expect(parsing[0]).to.be.an('object');
            expect(parsing[0]).to.deep.equal({
                binderKey: 'text',
                value: 'user.name'
            });
            expect(parsing[1]).to.be.an('object');
            expect(parsing[1]).to.deep.equal({
                binderKey: 'model',
                value: 'user.city'
            });
        });
    });

    describe('#parseKeypath()', () => {
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

        it('should return an object containing 3 properties', () => {
            expect(parsing).to.be.an('object');
            expect(Object.keys(parsing)).to.have.lengthOf(3);
            expect(parsing).to.have.property('key', 'city');
            expect(parsing).to.have.deep.property('obj', {
                city: 'Berlin'
            });
            expect(parsing).to.have.property('val', 'Berlin');
        });
    });

    describe('#parseNode()', () => {
        describe('Parsing element node', () => {
            const node = {
                nodeType: 1,
                attributes: [{
                    name: 'bd-text',
                    value: 'user.name'
                }]
            };
            const parsing = parser.parseNode(node);

            it('should return an array of 1 element containing parsing result', () => {
                expect(parsing).to.be.an('array');
                expect(parsing).to.have.lengthOf(1);
                expect(parsing[0]).to.deep.equal({
                    binderKey: 'text',
                    value: 'user.name'
                });
            });
        });

        describe('Parsing text node', () => {
            const node = {
                nodeType: 3,
                textContent: '{{user.city}}'
            };
            const parsing = parser.parseNode(node);

            it('should return an array of 1 element containing parsing result', () => {
                expect(parsing).to.be.an('array');
                expect(parsing).to.have.lengthOf(1);
                expect(parsing[0]).to.deep.equal({
                    binderKey: 'text',
                    value: 'user.city'
                });
            });
        });
    });

    describe('#parseTextNode()', () => {
        const textContent = '{{foo.bar}}';
        const regExp = new RegExp(/{{(.*?)}}/);
        const parsing = parser.parseTextNode(textContent, regExp);

        it('should return an array of 1 object containing parsing result', () => {
            expect(parsing).to.be.an('array');
            expect(parsing).to.have.lengthOf(1);
            expect(parsing[0]).to.be.an('object');
            expect(parsing[0]).to.deep.equal({
                binderKey: 'text',
                value: 'foo.bar'
            });
        });
    });
});