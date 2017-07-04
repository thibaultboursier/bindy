const parser = require('./parser');
const utils = require('./utils');

/**
 * Class representing a binding.
 */
export class Binding {
    /**
     * Create a binding.
     * @param {Object}
     * @constructor
     */
    constructor({
        DOM,
        node,
        keypath,
        target,
        type,
        watcher
    }) {
        Object.assign(this, {
            DOM,
            node,
            keypath,
            target,
            type,
            watcher
        });
    }

    /**
     * Initialize binding.
     * @return {Object}
     */
    bind() {
        const {
            type
        } = this;

        this.parseKeypath();

        switch (type) {
            case 'property':
                return this.bindProperty();
            case 'event':
                return this.bindEvent();
        }
    }

    /**
     * Bind event.
     */
    bindEvent() {
        const {
            node,
            key,
            obj
        } = this;
        const handler = (event) => {
            const value = event.target.value;

            obj[key] = this.val = value;
        };

        node.addEventListener('keyup', handler);
        node.addEventListener('keydown', handler);
        node.addEventListener('change', handler);

        return this;
    }

    /**
     * Bind property.
     */
    bindProperty() {
        const {
            key,
            keypath,
            obj,
            val,
            watcher
        } = this;

        if (!obj) {
            utils.error('Binding\'s object is not defined');
        }

        if (!obj.hasOwnProperty(key)) {
            return;
        }

        // Register keypath and trigger callback when value changes.
        watcher.watch(obj, key, keypath, (newVal) => {
            this.update(newVal);
        });

        obj[key] = val;

        // Binding's value is rendered if it's defined.
        if (val) {
            this.render(val);
        }

        return this;
    }

    /**
     * Broadcast event.
     */
    emit() {
        const updateEvent = new CustomEvent('update', {
            detail: {}
        });

        this.DOM.dispatchEvent(updateEvent);
    }

    /**
     * Parse binding's keypath.
     * @return {Object}
     */
    parseKeypath() {
        const {
            keypath,
            target
        } = this;
        const parsing = parser.parseKeypath({
            keypath,
            target
        });

        // Parsing result is assigned to binding instance
        Object.assign(this, parsing);

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
        } = this.node;

        switch (nodeType) {
            case 1:
                this.node.innerText = val;
                break;
            case 3:
                this.node.textContent = val;
        }

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
}