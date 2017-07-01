const {
    expect
} = require('chai');
const sinon = require('sinon');

const {
    Binding
} = require('../src/binding');
const mock = require('./mock/default.mock');

describe('Binding', () => {
    let propertyBinding;
    let eventBinding;

    beforeEach(() => {
        propertyBinding = new Binding(mock.propertyBinding);
        eventBinding = new Binding(mock.eventBinding);
    });

    describe('#bind()', () => {

        it('should call keypath parsing', () => {
            const stub = sinon.stub(propertyBinding, 'parseKeypath');

            propertyBinding.obj = propertyBinding.target.user;
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
            const {
                node,
                target
            } = propertyBinding;

            target.user.password = 'J921KDMN';
            propertyBinding.bind();
            expect(node.innerText).to.equal('J921KDMN');
        });

        it('should init event binding with object refreshing when value changes', () => {
            const {
                node,
                target
            } = eventBinding;
            const {
                window
            } = mock;
            const event = new window.Event('change');

            eventBinding.bind();

            const {
                obj,
                key
            } = eventBinding;
            node.value = 'Roma';
            node.dispatchEvent(event);
            expect(eventBinding.val).to.equal('Roma');
            expect(obj[key]).to.equal('Roma');
        });
    });

    describe('#bindEvent', () => {

        it('should add event listeners on binding\'s node', () => {

        })
    });


    describe('#bindProperty', () => {

        it('should add a setter on property', () => {
            const {
                target
            } = propertyBinding;

            propertyBinding.key = 'password';
            propertyBinding.obj = target.user;
            propertyBinding.bindProperty();
            expect(propertyBinding.obj).ownPropertyDescriptor(propertyBinding.key).to.have.property('set');
        });
    });

    describe('#emit', () => {

        it('should dispatch update event', () => {

        })
    });

    describe('#parseKeypath', () => {

        it('should add parsing result to instance', () => {

        });
    });

    describe('#render', () => {

        it('should update DOM element\'s content with property\'s value', () => {

        });
    });

    describe('#update', () => {

        it('should update property value', () => {

        });

        it('should call render method', () => {

        });
    });
});