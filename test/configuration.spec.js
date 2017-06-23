const { expect } = require('chai');
const configuration = require('../src/configuration');

describe('Configuration', function () {
    
    it('should have a delimiters property', function () {
        expect(configuration).to.have.deep.property('delimiters', ['{{', '}}']);
    });

    it('should have a prefix property', function () {
        expect(configuration).to.have.property('prefix', 'bd');
    });
});