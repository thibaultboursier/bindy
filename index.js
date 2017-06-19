'use strict';

class Bindy {}

Bindy.bind = (...args) => {
    const view = new View(...args);

    view.init();

    return view;
};

/**
 * Class representing a binding.
 */
class Binding {
    /**
     * Create a binding.
     * @param {Object}
     */
    constructor({
        el,
        keypath,
        target
    }) {
        Object.assign(this, {
            el,
            keypath,
            target
        });
    }

    /**
     * Initialize binding.
     * @return {Object}
     */
    bind() {
        const {
            obj,
            target,
            key,
            keypath,
            val
        } = this;

        // Binding's value is rendered if it's defined.
        if (val) {
            this.render(val);
        }

        Object.defineProperty(obj || target, key, {
            enumerable: true,
            set: (newVal) => this.update(newVal)
        })

        return this;
    }

    /**
     * Update binding's output.
     * @param {*} newVal - Binding's new value.
     * @return {Object}
     */
    update(newVal) {
        this.val = newVal;

        this.render();

        return this;
    }

    /**
     * Update binding's output.
     * @param {*} val - Binding's value.
     * @return {Object}
     */
    render(val = this.val) {
        const {
            nodeType
        } = this.el;

        switch (nodeType) {
            case 1:
                this.el.innerText = val;
                break;
            case 3:
                this.el.textContent = val;
        }

        return this;
    }

    /**
     * Parse binding's keypath.
     * @return {Object}
     */
    parseKeypath() {
        const keys = this.keypath.split('.');
        const {
            length
        } = keys;
        let obj;
        let key;

        let val = keys.reduce((prev, curr, index) => {
            switch (index) {
                case length - 1:
                    key = curr;
                    break;
                case length - 2:
                    obj = prev[curr];
                    break;
            }

            return prev ? prev[curr] : undefined;
        }, this.target);

        Object.assign(this, {
            obj,
            key,
            val
        });

        return this;
    }
}

/**
 * Class representing a view.
 */
class View {
    /**
     * Create a view.
     * @param {Object} target - Target.
     * @param {HTMLElement} DOM - DOM. 
     */
    constructor(target, DOM) {
        if (!target) {
            error('You must provide an object for binding.');
        }

        if (!DOM) {
            error('You must provide an HTML element for binding.');
        }

        this.prefix = 'bd';
        this.target = target;
        this.DOM = DOM;
        this.bindings = [];
        this.binders = {
            text(el, value) {
                const keypath = value;

                this.register({
                    el,
                    keypath
                });
            }
        };
    }

    /**
     * Initialize view.
     */
    init() {
        // DOM is parsed to look for bindings.
        this.traverseDOM();
        // Each binding is initialized.
        this.bindings.forEach((binding) => this.bind(binding));
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
     * Refresh.
     */
    refresh() {
        this.bindings.length = 0;

        return this.init();
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
     * Get child nodes.
     * @param {Object} node - Node.
     */
    getChildNodes(node) {
        const bindingRegExp = this.getBindingRegExp();
        const {
            childNodes,
            nodeType,
            attributes
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
     * Register new binding.
     * @param {Object}
     * @return {Object}
     */
    register({
        el,
        keypath
    }) {
        const {
            target
        } = this;
        const binding = new Binding({
            el,
            keypath,
            target
        });

        this.bindings.push(binding);

        return binding;
    }

    /**
     * Initialize binding on binding object.
     * @param {Object} binding 
     */
    bind(binding) {
        binding
            .parseKeypath()
            .bind();
    }

    /**
     * Get binding RegExp.
     * @return {String}
     */
    getBindingRegExp() {
        return new RegExp(`${this.prefix}-`);
    };
}

function error(message) {
    throw new Error('[bindy] ' + message)
}

// Export module for Node and the browser.
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Bindy;
} else if (typeof define === 'function' && define.amd) {
    define([], function () {
        return this.Bindy = Bindy;
    })
} else {
    this.Bindy = Bindy;
}