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
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });


const View = __webpack_require__(1);

/**
 * Class representing a bindy.
 */
class Bindy {}
/* harmony export (immutable) */ __webpack_exports__["Bindy"] = Bindy;


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

/***/ }),
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* WEBPACK VAR INJECTION */(function(module) {

const Binding = __webpack_require__(3);

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
        this.bindings.forEach((binding) => this.bind(binding));
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
    update({
        detail: {
            keypath,
            value
        }
    }) {
        this.bindings.filter(binding => binding.keypath === keypath)
            .forEach(binding => binding.update(value));
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
/* harmony export (immutable) */ __webpack_exports__["View"] = View;


function error(message) {
    throw new Error('[bindy] ' + message)
}

// Export module for Node and the browser.
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Bindy;
} else if (typeof define === 'function' && __webpack_require__(4)) {
    define([], function () {
        return this.Bindy = Bindy;
    })
} else {
    this.Bindy = Bindy;
}
/* WEBPACK VAR INJECTION */}.call(__webpack_exports__, __webpack_require__(2)(module)))

/***/ }),
/* 2 */
/***/ (function(module, exports) {

module.exports = function(originalModule) {
	if(!originalModule.webpackPolyfill) {
		var module = Object.create(originalModule);
		// module.parent = undefined by default
		if(!module.children) module.children = [];
		Object.defineProperty(module, "loaded", {
			enumerable: true,
			get: function() {
				return module.l;
			}
		});
		Object.defineProperty(module, "id", {
			enumerable: true,
			get: function() {
				return module.i;
			}
		});
		Object.defineProperty(module, "exports", {
			enumerable: true,
		});
		module.webpackPolyfill = 1;
	}
	return module;
};


/***/ }),
/* 3 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });


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
            set: (newVal) => this.emit(newVal)
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
            val
        } = this;
        const handler = (event) => {
            const value = event.target.value;

            this.emit(value);
        }

        el.addEventListener('keyup', handler);
        el.addEventListener('change', handler);

        return this;
    }

    /**
     * Broadcast event.
     */
    emit(value) {
        const {
            DOM,
            keypath
        } = this;
        const updateEvent = new CustomEvent('update', {
            detail: {
                keypath,
                value
            }
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
        const keys = this.keypath.split('.');
        const {
            target
        } = this;
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

        obj = obj || target;

        Object.assign(this, {
            obj,
            key,
            val
        });

        return this;
    }
}
/* harmony export (immutable) */ __webpack_exports__["Binding"] = Binding;


/***/ }),
/* 4 */
/***/ (function(module, exports) {

/* WEBPACK VAR INJECTION */(function(__webpack_amd_options__) {/* globals __webpack_amd_options__ */
module.exports = __webpack_amd_options__;

/* WEBPACK VAR INJECTION */}.call(exports, {}))

/***/ })
/******/ ]);