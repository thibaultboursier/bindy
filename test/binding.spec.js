const { expect } = require('chai');
const { JSDOM } = require('jsdom');
const sinon = require('sinon');

const { Binding } = require('../src/binding');
const { propertyBinding } = require('./mock/default.mock');

describe('Binding', () => {
    const { keypath, target, type } = propertyBinding;
    const DOM = new JSDOM(propertyBinding.DOM).window.document.querySelector('#container');
    const node = DOM.querySelector('p');
    const binding = new Binding({
        DOM,
        node,
        keypath,
        target,
        type
    });
    binding.obj = 'private';

    describe('#bind()', () => {

        it('should call keypath parsing', () => {
            const stub = sinon.stub(binding, 'parseKeypath');
            binding.bind();
            expect(binding.parseKeypath.called).to.equal(true);
            stub.restore();            
        });

        it('should call property binding', () => {
            const stub = sinon.stub(binding, 'bindProperty');
            binding.bind();
            expect(binding.bindProperty.called).to.equal(true);  
            stub.restore();                      
        });
    });

    describe('#bindProperty', () => {

        it('should add a setter on property', () => {
            binding.bindProperty();
            expect(binding.obj).ownPropertyDescriptor(binding.key).to.have.property('set');
        })
    });
});