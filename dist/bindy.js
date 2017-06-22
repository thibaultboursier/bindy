(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["Bindy"] = factory();
	else
		root["Bindy"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
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
/******/ 	return __webpack_require__(__webpack_require__.s = 2);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
const configuration = __webpack_require__(6);

/**
 * Get attribute RegExp.
 * @return {String}
 */
const getAttributeRegExp = function getAttributeRegExp() {
    const {
        prefix
    } = configuration;

    return new RegExp(`${prefix}-`);
};

/**
 * Get interpolation RegExp.
 * @return {Object}
 */
const getInterpolationRegExp = function getInterpolationRegExp() {
    const {
        delimiters
    } = configuration;
    const [start, end] = delimiters;

    return new RegExp(`${start}(.*?)${end}`);
};

/**
 * Parse attributes to find binders.
 * @param {String} attributes - Node attributes.
 * @param {String} regExp - Regular expression.
 */
const parseAttributes = function parseAttributes(attributes, regExp) {
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
/* harmony export (immutable) */ __webpack_exports__["parseAttributes"] = parseAttributes;


/**
 * Parse keypath.
 * @param {Object}
 * @return {Object}
 */
const parseKeypath = function parseKeypath({
    keypath,
    target
}) {
    const keys = keypath.split('.');
    const {
        length
    } = keys;
    let obj;
    let key;

    const val = keys.reduce((prev, curr, index) => {
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


/**
 * Parse node.
 * @param {Object} node - Node. 
 * @return {Object}
 */
const parseNode = function parseNode(node) {
    const {
        attributes,
        childNodes,
        nodeType,
        textContent
    } = node;
    let regExp;

    switch (nodeType) {
        case 1:
            regExp = getAttributeRegExp();
            return parseAttributes(attributes, regExp);
        case 3:
            regExp = getInterpolationRegExp();
            return parseTextNode(textContent, regExp);
    }
}
/* harmony export (immutable) */ __webpack_exports__["parseNode"] = parseNode;


/**
 * Parse text node to find expressions.
 * @param {String} textContent - Node text content.
 * @param {String} regExp - Regular expression.
 */
const parseTextNode = function parseTextNode(textContent, regExp) {
    const binder = 'text';

    if (regExp.test(textContent)) {
        const value = textContent.trim().match(regExp)[1];

        return [{
            binder,
            value
        }];
    }
}
/* harmony export (immutable) */ __webpack_exports__["parseTextNode"] = parseTextNode;


/***/ }),
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/**
 * Error handler.
 * @param {String} message - Message to print.
 */
const error = function error(message) {
    throw new Error(`[bindy] ${message}`);
};
/* harmony export (immutable) */ __webpack_exports__["error"] = error;


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

const {
    View
} = __webpack_require__(3);

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

module.exports = Bindy;

/***/ }),
/* 3 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
const {
    Binding
} = __webpack_require__(4);
const utils = __webpack_require__(1);
const binders = __webpack_require__(5);
const parser = __webpack_require__(0);

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
            error(`Binding (${key}) is already registered.`);
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

    /**
     * Update bindings.
     * @param {Object}
     */
    update() {}
}
/* harmony export (immutable) */ __webpack_exports__["View"] = View;


/***/ }),
/* 4 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
const parser = __webpack_require__(0);

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
     * Bind event.
     */
    bindEvent() {
        const {
            el,
            key,
            keypath,
            obj,
            target,
            val
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
     * Bind property.
     */
    bindProperty() {
        const {
            key,
            keypath,
            obj,
            target,
            val
        } = this;

        // Binding's value is rendered if it's defined.
        if (val) {
            this.render(val);
        }

        if (obj.hasOwnProperty(key)) {
            Object.defineProperty(obj, key, {
                enumerable: true,
                set: (newVal) => this.update(newVal)
            })
        };

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
/* harmony export (immutable) */ __webpack_exports__["Binding"] = Binding;


/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

const utils = __webpack_require__(1);

module.exports = {
    /**
     * Text binder.
     * @param {HTMLElement} el - HTML element. 
     * @param {String} value - Value.
     */
    text(el, value) {
        const type = 'property';

        this.register({
            el,
            keypath: value,
            type
        });
    },
    /**
     * Model binder.
     * @param {HTMLElement} el - HTML element. 
     * @param {String} value - Value.
     */
    model(el, value) {
        const type = 'event';

        this.register({
            el,
            keypath: value,
            type
        });
    }
};

/***/ }),
/* 6 */
/***/ (function(module, exports) {

module.exports = {
    delimiters: ['{{', '}}'],
    prefix: 'bd'
};

/***/ })
/******/ ]);
});