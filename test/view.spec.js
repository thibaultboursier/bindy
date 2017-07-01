const {
    expect
} = require('chai');
const sinon = require('sinon');

const {
    View
} = require('../src/view');
const mock = require('./mock/default.mock');

describe('View', () => {
    let view;

    beforeEach(() => {
        view = new View(mock.target, mock.DOM);
    });

    describe('#addBinder()', () => {

        it('should ad new binder', () => {

        });
    });

    describe('#init()', () => {

        it('should call traverseDOM method', () => {

        });

        it('should call bind method on each binding', () => {

        });
    });

    describe('#getChildNodes()', () => {

        it('should iterate recursively over each node children', () => {

        });
    });

    describe('#refresh()', () => {

        it('should clear bindings array', () => {

        });

        it('should call init method', () => {

        });
    });

    describe('#register()', () => {

        it('should register new binding', () => {

        });
    });

    describe('#traverseDOM()', () => {

        it('should call getChildNodes method', () => {

        });
    });
});