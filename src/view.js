const {
    Binding
} = require('./binding');
const utils = require('./utils');
const binders = require('./binders');

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
     * Get attribute RegExp.
     * @return {String}
     */
    getAttributeRegExp() {
        return new RegExp(`${this.prefix}-`);
    };

    /**
     * Get child nodes.
     * @param {Object} node - Node.
     */
    getChildNodes(node) {
        const regExp = this.getAttributeRegExp();
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
     * Get interpolation RegExp.
     * @return {String}
     */
    getInterpolationRegExp() {
        return new RegExp(/{{(.*?)}}/);
    };

    /**
     * Parse attributes to find binders.
     */
    parseAttributes(attributes) {
        const regExp = this.getAttributeRegExp();

        return Array.from(attributes)
            .filter(({
                name
            }) => regExp.test(name))
            .map(({
                value,
                name
            }) => {
                const binder = name.replace(regExp, '');

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
        const regExp = this.getInterpolationRegExp();

        if (regExp.test(textContent)) {
            const value = textContent.trim().match(regExp)[1];

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