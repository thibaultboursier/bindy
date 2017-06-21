'use strict';

const {
    Binding
} = require('./binding');
const utils = require('./utils');

/**
 * Class representing a view.
 */
export class View {
    /**
     * Create a view.
     * @param {Object} target - Target.
     * @param {HTMLElement} DOM - DOM. 
     */
    constructor(target, DOM) {
        if (!target) {
            utils.error('You must provide an object for binding.');
        }

        if (!DOM) {
            utils.error('You must provide an HTML element for binding.');
        }

        this.prefix = 'bd';
        this.target = target;
        this.DOM = DOM;
        this.bindings = [];
        this.binders = {
            text(el, value) {
                const keypath = value;
                const type = 'property';

                this.register({
                    el,
                    keypath,
                    type
                });
            },
            model(el, value) {
                const keypath = value;
                const type = 'event';

                this.register({
                    el,
                    keypath,
                    type
                });
            }
        };
    }

    /**
     * Add new binder.
     * @param {String} key - Binder's key.
     * @param {Function} fn - Binder's function.
     * @return {Object}
     */
    addBinder(key, fn) {
        if (binders.hasOwnProperty(key)) {
            error(`Binding [${key}] is already registered.`);
        }

        this.binders[key] = fn;

        return this;
    }

    /**
     * Initialize view.
     */
    init() {
        // DOM is parsed to look for bindings.
        this.traverseDOM();
        // Each binding is initialized.
        this.bindings.forEach((binding) => binding.bind());
    }

    /**
     * Get binding RegExp.
     * @return {String}
     */
    getBindingRegExp() {
        return new RegExp(`${this.prefix}-`);
    };

    /**
     * Get child nodes.
     * @param {Object} node - Node.
     */
    getChildNodes(node) {
        const bindingRegExp = this.getBindingRegExp();
        const {
            attributes,
            childNodes,
            nodeType
        } = node;
        let results;

        switch (nodeType) {
            case 1:
                results = this.parseAttributes(attributes);
                break;
            case 3:
                results = this.parseTextNode(node);
                break;
        }

        results && results.forEach(({
            binder,
            value
        }) => this.binders[binder].call(this, node, value));

        // Call recursively getChildNodes method.
        childNodes.forEach(this.getChildNodes.bind(this));
    }

    /**
     * Parse attributes to find binders.
     */
    parseAttributes(attributes) {
        const bindingRegExp = this.getBindingRegExp();

        return Array.from(attributes)
            .filter(({
                name
            }) => bindingRegExp.test(name))
            .map(({
                value,
                name
            }) => {
                const binder = name.replace(bindingRegExp, '');

                return {
                    binder,
                    value
                }
            });
    }

    /**
     * Parse text node to find expressions.
     * @param {Object}
     */
    parseTextNode({
        textContent
    }) {
        const binder = 'text';

        if (/{{(.*?)}}/.test(textContent)) {
            const value = textContent.trim().match(/{{(.*?)}}/)[1];

            return [{
                binder,
                value
            }];
        }
    }

    /**
     * Refresh.
     */
    refresh() {
        this.bindings.length = 0;

        return this.init();
    }

    /**
     * Register new binding.
     * @param {Object}
     * @return {Object}
     */
    register({
        el,
        keypath,
        type
    }) {
        const {
            DOM,
            target
        } = this;
        const binding = new Binding({
            DOM,
            el,
            keypath,
            target,
            type
        });

        this.bindings.push(binding);

        return binding;
    }

    /**
     * For-loop on each DOM node to look for bindings.
     * @return {Object}
     */
    traverseDOM() {
        this.getChildNodes(this.DOM);

        return this;
    }

    /**
     * Update bindings.
     * @param {Object}
     */
    update() {}
}