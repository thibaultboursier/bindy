'use strict';

class Bindy {}
Bindy.bind = (...args) => {
    const core = new Core(...args);
    core.init();
};

class Core {
    constructor(target, DOM) {
        if (!target) {
            throw new Error('You must provide an object for binding.');
        }

        if (!DOM) {
            throw new Error('You must provide an HTML element for binding.');
        }

        this.target = target;
        this.DOM = DOM;
        this.temp = {};
        this.bindings = {};
    }

    init() {
        this.DOMList = Array.from(this.DOM.querySelectorAll('[bind]'));
        this.DOMList
            .map((el) => this.register(el))
            .forEach((el) => this.add(el));

        if (Object.keys(this.temp).length !== 0) {
            this.watch();
        }
    }

    register(el) {
        const property = el.getAttribute('bind');
        this.bindings[property] = el;
        return property;
    }

    add(property) {
        const binding = this.getBinding(property);

        if (!binding.val) {
            return this.temp[property] = null;
        }

        this.bind(binding);
    }

    addNewProperty({
        obj,
        key,
        val,
        property
    }) {
        delete this.temp[property];
        this.bind({
            obj,
            key,
            val,
            property
        });
        this.updateDOM({
            property,
            val
        });
    }

    bind({
        obj,
        key,
        val,
        property
    }) {
        Object.defineProperty(obj || this.target, key, {
            enumerable: true,
            set: (val) => this.updateDOM({
                property,
                val
            })
        })
    }

    updateDOM({
        property,
        val
    }) {
        const el = this.bindings[property];
        el.innerText = val;
    }

    getBinding(property) {
        const parts = property.split('.');
        const {
            length
        } = parts;
        let obj;
        let key;

        let val = parts.reduce((prev, curr, index) => {
            switch (index) {
                case length - 1:
                    key = curr;
                    break;
                case length - 2:
                    obj = prev[curr];
                    break;
            }

            return prev ? prev[curr] : undefined;
        }, scope);

        return {
            obj,
            key,
            val,
            property
        };
    }

    watch() {
        setInterval(() => {
            for (let property in this.temp) {
                if (!this.temp.hasOwnProperty(property)) return;

                const binding = this.getBinding(property);

                if (binding.val) {
                    this.addNewProperty(binding);
                }
            }
        }, 200);
    }
}

let scope = {};
const bindy = Bindy.bind(scope, document.body);