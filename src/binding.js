'use strict';

const parser = require('./parser');

/**
 * Class representing a binding.
 */
export class Binding {
    /**
     * Create a binding.
     * @param {Object}
     */
    constructor({
        DOM,
        el,
        keypath,
        target,
        type
    }) {
        Object.assign(this, {
            DOM,
            el,
            keypath,
            target,
            type
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

        this.parseKeypath()

        switch (type) {
            case 'property':
                return this.bindProperty();
            case 'event':
                return this.bindEvent();
        }
    }

    /**
     * Bind property.
     */
    bindProperty() {
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

        Object.defineProperty(obj, key, {
            enumerable: true,
            set: (newVal) => this.update(newVal)
        })

        return this;
    }

    /**
     * Bind event.
     */
    bindEvent() {
        const {
            el,
            obj,
            key,
            keypath,
            val,
            target
        } = this;
        const handler = (event) => {
            const value = event.target.value;

            obj[key] = value;
        }

        el.addEventListener('keyup', handler);
        el.addEventListener('keydown', handler);
        el.addEventListener('change', handler);

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
}