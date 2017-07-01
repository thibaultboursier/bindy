const {
    Binding
} = require('./binding');
const utils = require('./utils');
const binders = require('./binders');
const parser = require('./parser');

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

        this.target = target;
        this.DOM = DOM;
        this.bindings = [];
        this.binders = binders;
    }

    /**
     * Add new binder.
     * @param {String} key - Binder's key.
     * @param {Function} fn - Binder's function.
     * @return {Object}
     */
    addBinder(key, fn) {
        if (binders.hasOwnProperty(key)) {
            utils.error(`Binding (${key}) is already registered.`);
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
        this.bindings.forEach(binding => binding.bind());
    }

    /**
     * Get child nodes.
     * @param {Object} node - Node.
     */
    getChildNodes(node, callback) {
        const {
            childNodes
        } = node;

        if (typeof callback === 'function') {
            callback.call(this, node);
        }

        // Call recursively getChildNodes method.
        if (childNodes) {
            Array.from(childNodes).forEach(childNode => this.getChildNodes(childNode, callback));
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
        node,
        keypath,
        type
    }) {
        const {
            DOM,
            target
        } = this;
        const binding = new Binding({
            DOM,
            node,
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
        this.getChildNodes(this.DOM, node => {
            const parsing = parser.parseNode(node);

            // For each parsing result, binder is called.
            parsing && parsing.forEach(({
                binder,
                value
            }) => this.binders[binder].call(this, node, value));
        });

        return this;
    }
}