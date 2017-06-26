const { expect } = require('chai');
const sinon = require('sinon');

const { Binding } = require('../src/binding');
const mock = require('./mock/default.mock');

describe('Binding', () => {
    let propertyBinding;
    let eventBinding;

    beforeEach(() => {
        propertyBinding = new Binding(mock.propertyBinding);
        eventBinding = new Binding(mock.eventBinding);
        
        propertyBinding.obj = eventBinding.obj = 'user';
    });

    describe('#bind()', () => {

        it('should call keypath parsing', () => {
            const stub = sinon.stub(propertyBinding, 'parseKeypath');

            propertyBinding.bind();
            expect(propertyBinding.parseKeypath.called).to.equal(true);
            stub.restore();            
        });

        it('should call property binding', () => {
            const stub = sinon.stub(propertyBinding, 'bindProperty');

            propertyBinding.bind();
            expect(propertyBinding.bindProperty.called).to.equal(true);  
            stub.restore();                      
        });

        it('should init property binding with DOM rendering', () => {
            const {node, target} = propertyBinding;
            
            target.user.password = 'J921KDMN';
            propertyBinding.bind();
            expect(node.innerText).to.equal('J921KDMN');
        });

        it('should init event binding with object refreshing', () => {
            // TODO event binding
        });
    });

    describe('#bindProperty', () => {

        it('should add a setter on property', () => {
            const {key, obj} = propertyBinding;

            propertyBinding.bindProperty();
           // expect(obj).ownPropertyDescriptor(key).to.have.property('set');
        })
    });
});