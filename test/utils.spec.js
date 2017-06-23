const { expect } = require('chai');
const utils = require('../src/utils');

describe('Utils', function () {

    describe('error', function () {
        it('should throw an error', function () {
            expect(utils.error).to.throw();
        });
    });
});