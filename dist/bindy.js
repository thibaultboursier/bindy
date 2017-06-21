/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


const {View} = __webpack_require__(1);

/**
 * Class representing a bindy.
 */
class Bindy {}

/**
 * Bind.
 * @public
 * @static
 */
Bindy.bind = (...args) => {
    const view = new View(...args);

    view.init();

    return view;
};

// Export module for Node and the browser.
window.Bindy = Bindy;

/***/ }),
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });


const {
    Binding
} = __webpack_require__(2);

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
     * Initialize view.
     */
    init() {
        // DOM is parsed to look for bindings.
        this.traverseDOM();
        // Each binding is initialized.
        this.bindings.forEach((binding) => binding.bind());
        this.DOM.addEventListener('update', this.update.bind(this));
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
     * Update bindings.
     * @param {Object}
     */
    update() {}

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
        keypath,
        type
    }) {
        const {
            DOM,
            target
        } = this;
        const binding = new Binding({
            el,
            keypath,
            type,
            target,
            DOM
        });

        this.bindings.push(binding);

        return binding;
    }

    /**
     * Get binding RegExp.
     * @return {String}
     */
    getBindingRegExp() {
        return new RegExp(`${this.prefix}-`);
    };
}
/* harmony export (immutable) */ __webpack_exports__["View"] = View;


function error(message) {
    throw new Error('[bindy] ' + message)
}

/***/ }),
/* 2 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });


const parser = __webpack_require__(3);

/**
 * Class representing a binding.
 */
class Binding {
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
/* harmony export (immutable) */ __webpack_exports__["Binding"] = Binding;


/***/ }),
/* 3 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/**
 * Parse keypath.
 * @param {Object}
 * @return {Object}
 */
const parseKeypath = ({
    keypath,
    target
}) => {
    const keys = keypath.split('.');
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
    }, target);

    obj = obj || target;

    return {
        obj,
        key,
        val
    };
};
/* harmony export (immutable) */ __webpack_exports__["parseKeypath"] = parseKeypath;


/***/ })
/******/ ]);