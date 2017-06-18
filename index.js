'use strict';

class Bindy {}

Bindy.bind = (...args) => {
    const view = new View(...args);
    view.init();
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
        this.el.innerText = val;

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
            throw new Error('You must provide an object for binding.');
        }

        if (!DOM) {
            throw new Error('You must provide an HTML element for binding.');
        }

        this.prefix = 'bd';
        this.target = target;
        this.DOM = DOM;
        this.bindings = [];
    }

    /**
     * Initialize view.
     */
    init() {
        this.DOMList = Array.from(this.DOM.querySelectorAll(`[${this.prefix}-bind]`));
        this.DOMList
            .map((el) => this.register(el))
            .forEach((binding) => this.bind(binding));
    }

    /**
     * Register HTMLElement and create new binding.
     * @param {Object} el - HTML element.
     * @return {Object}
     */
    register(el) {
        const keypath = el.getAttribute(`${this.prefix}-bind`);
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