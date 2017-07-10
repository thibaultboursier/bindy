const {
    Binding
} = require('./binding');
const utils = require('./utils');
const binders = require('./binders');
const parser = require('./parser');
const {
    Watcher
} = require('./watcher');

/**
 * Class representing a view.
 */
export class View {
    /**
     * Create a view.
     * @param {Object} target - Target.
     * @param {HTMLElement} DOM - DOM. 
     * @constructor
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
        this.watcher = new Watcher();
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
            childNodes,
            nodeType
        } = node;

        if (typeof callback === 'function') {
            callback.call(this, node);
        }

        if (nodeType === 1 && node.getAttribute('bd-for')) {
            return;
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
            target,
            watcher
        } = this;
        const binding = new Binding({
            DOM,
            node,
            keypath,
            target,
            type,
            watcher
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
                binderKey,
                value
            }) => {
                const binder = this.binders[binderKey];

                if (!binder) {
                    return utils.error(`Binder (${binderKey}) is not defined.`);
                }

                binder.call(this, node, value);
            });
        });

        return this;
    }
}