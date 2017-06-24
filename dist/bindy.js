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
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var configuration = __webpack_require__(5);

/**
 * Get attribute RegExp.
 * @return {String}
 */
var getAttributeRegExp = exports.getAttributeRegExp = function getAttributeRegExp() {
    var prefix = configuration.prefix;


    return new RegExp(prefix + '-');
};

/**
 * Get interpolation RegExp.
 * @return {Object}
 */
var getInterpolationRegExp = exports.getInterpolationRegExp = function getInterpolationRegExp() {
    var delimiters = configuration.delimiters;

    var _delimiters = _slicedToArray(delimiters, 2),
        start = _delimiters[0],
        end = _delimiters[1];

    return new RegExp(start + '(.*?)' + end);
};

/**
 * Parse attributes to find binders.
 * @param {String} attributes - Node attributes.
 * @param {String} regExp - Regular expression.
 */
var parseAttributes = exports.parseAttributes = function parseAttributes(attributes, regExp) {
    return Array.from(attributes).filter(function (_ref) {
        var name = _ref.name;
        return regExp.test(name);
    }).map(function (_ref2) {
        var value = _ref2.value,
            name = _ref2.name;

        var binder = name.replace(regExp, '');

        return {
            binder: binder,
            value: value
        };
    });
};

/**
 * Parse keypath.
 * @param {Object}
 * @return {Object}
 */
var parseKeypath = exports.parseKeypath = function parseKeypath(_ref3) {
    var keypath = _ref3.keypath,
        target = _ref3.target;

    var keys = keypath.split('.');
    var length = keys.length;

    var obj = void 0;
    var key = void 0;

    var val = keys.reduce(function (prev, curr, index) {
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
        key: key,
        obj: obj,
        val: val
    };
};

/**
 * Parse node.
 * @param {Object} node - Node. 
 * @return {Object}
 */
var parseNode = exports.parseNode = function parseNode(node) {
    var attributes = node.attributes,
        childNodes = node.childNodes,
        nodeType = node.nodeType,
        textContent = node.textContent;

    var regExp = void 0;

    switch (nodeType) {
        case 1:
            regExp = getAttributeRegExp();
            return parseAttributes(attributes, regExp);
        case 3:
            regExp = getInterpolationRegExp();
            return parseTextNode(textContent, regExp);
    }
};

/**
 * Parse text node to find expressions.
 * @param {String} textContent - Node text content.
 * @param {String} regExp - Regular expression.
 */
var parseTextNode = exports.parseTextNode = function parseTextNode(textContent, regExp) {
    var binder = 'text';

    if (regExp.test(textContent)) {
        var value = textContent.trim().match(regExp)[1];

        return [{
            binder: binder,
            value: value
        }];
    }
};

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
/**
 * Error handler.
 * @param {String} message - Message to print.
 */
var error = exports.error = function error(message) {
  throw new Error("[bindy] " + message);
};

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _require = __webpack_require__(3),
    View = _require.View;

/**
 * Class representing a bindy.
 */


var Bindy = function Bindy() {
    _classCallCheck(this, Bindy);
};

/**
 * Bind.
 * @public
 * @static
 */


Bindy.bind = function () {
    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
    }

    var view = new (Function.prototype.bind.apply(View, [null].concat(args)))();

    view.init();

    return view;
};

module.exports = Bindy;

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _require = __webpack_require__(4),
    Binding = _require.Binding;

var utils = __webpack_require__(1);
var binders = __webpack_require__(6);
var parser = __webpack_require__(0);

/**
 * Class representing a view.
 */

var View = exports.View = function () {
    /**
     * Create a view.
     * @param {Object} target - Target.
     * @param {HTMLElement} DOM - DOM. 
     */
    function View(target, DOM) {
        _classCallCheck(this, View);

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


    _createClass(View, [{
        key: 'addBinder',
        value: function addBinder(key, fn) {
            if (binders.hasOwnProperty(key)) {
                error('Binding (' + key + ') is already registered.');
            }

            this.binders[key] = fn;

            return this;
        }

        /**
         * Initialize view.
         */

    }, {
        key: 'init',
        value: function init() {
            // DOM is parsed to look for bindings.
            this.traverseDOM();
            // Each binding is initialized.
            this.bindings.forEach(function (binding) {
                return binding.bind();
            });
        }

        /**
         * Get child nodes.
         * @param {Object} node - Node.
         */

    }, {
        key: 'getChildNodes',
        value: function getChildNodes(node, callback) {
            var _this = this;

            var childNodes = node.childNodes;


            if (typeof callback === 'function') {
                callback.call(this, node);
            }

            // Call recursively getChildNodes method.
            if (childNodes) {
                Array.from(childNodes).forEach(function (childNode) {
                    return _this.getChildNodes(childNode, callback);
                });
            }
        }

        /**
         * Refresh.
         */

    }, {
        key: 'refresh',
        value: function refresh() {
            this.bindings.length = 0;

            return this.init();
        }

        /**
         * Register new binding.
         * @param {Object}
         * @return {Object}
         */

    }, {
        key: 'register',
        value: function register(_ref) {
            var node = _ref.node,
                keypath = _ref.keypath,
                type = _ref.type;
            var DOM = this.DOM,
                target = this.target;

            var binding = new Binding({
                DOM: DOM,
                node: node,
                keypath: keypath,
                target: target,
                type: type
            });

            this.bindings.push(binding);

            return binding;
        }

        /**
         * For-loop on each DOM node to look for bindings.
         * @return {Object}
         */

    }, {
        key: 'traverseDOM',
        value: function traverseDOM() {
            var _this2 = this;

            this.getChildNodes(this.DOM, function (node) {
                var parsing = parser.parseNode(node);

                // For each parsing result, binder is called.
                parsing && parsing.forEach(function (_ref2) {
                    var binder = _ref2.binder,
                        value = _ref2.value;
                    return _this2.binders[binder].call(_this2, node, value);
                });
            });

            return this;
        }

        /**
         * Update bindings.
         * @param {Object}
         */

    }, {
        key: 'update',
        value: function update() {}
    }]);

    return View;
}();

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var parser = __webpack_require__(0);

/**
 * Class representing a binding.
 */

var Binding = exports.Binding = function () {
    /**
     * Create a binding.
     * @param {Object}
     */
    function Binding(_ref) {
        var DOM = _ref.DOM,
            node = _ref.node,
            keypath = _ref.keypath,
            target = _ref.target,
            type = _ref.type;

        _classCallCheck(this, Binding);

        Object.assign(this, {
            DOM: DOM,
            node: node,
            keypath: keypath,
            target: target,
            type: type
        });
    }

    /**
     * Initialize binding.
     * @return {Object}
     */


    _createClass(Binding, [{
        key: 'bind',
        value: function bind() {
            var type = this.type;


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

    }, {
        key: 'bindEvent',
        value: function bindEvent() {
            var node = this.node,
                key = this.key,
                keypath = this.keypath,
                obj = this.obj,
                target = this.target,
                val = this.val;

            var handler = function handler(event) {
                var value = event.target.value;

                obj[key] = value;
            };

            node.addEventListener('keyup', handler);
            node.addEventListener('keydown', handler);
            node.addEventListener('change', handler);

            return this;
        }

        /**
         * Bind property.
         */

    }, {
        key: 'bindProperty',
        value: function bindProperty() {
            var _this = this;

            var key = this.key,
                keypath = this.keypath,
                obj = this.obj,
                target = this.target,
                val = this.val;

            // Binding's value is rendered if it's defined.

            if (val) {
                this.render(val);
            }

            if (obj.hasOwnProperty(key)) {
                Object.defineProperty(obj, key, {
                    enumerable: true,
                    set: function set(newVal) {
                        return _this.update(newVal);
                    }
                });
            };

            return this;
        }

        /**
         * Broadcast event.
         */

    }, {
        key: 'emit',
        value: function emit() {
            var updateEvent = new CustomEvent('update', {
                detail: {}
            });

            this.DOM.dispatchEvent(updateEvent);
        }

        /**
         * Parse binding's keypath.
         * @return {Object}
         */

    }, {
        key: 'parseKeypath',
        value: function parseKeypath() {
            var keypath = this.keypath,
                target = this.target;

            var parsing = parser.parseKeypath({
                keypath: keypath,
                target: target
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

    }, {
        key: 'render',
        value: function render() {
            var val = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.val;
            var nodeType = this.node.nodeType;


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

    }, {
        key: 'update',
        value: function update(newVal) {
            this.val = newVal;

            this.render();

            return this;
        }
    }]);

    return Binding;
}();

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = {
    delimiters: ['{{', '}}'],
    prefix: 'bd'
};

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(1);

module.exports = {
    /**
     * Text binder.
     * @param {Object} node - Node. 
     * @param {String} value - Value.
     */
    text: function text(node, value) {
        var type = 'property';

        this.register({
            node: node,
            keypath: value,
            type: type
        });
    },

    /**
     * Model binder.
     * @param {Object} node - Node. 
     * @param {String} value - Value.
     */
    model: function model(node, value) {
        var type = 'event';

        this.register({
            node: node,
            keypath: value,
            type: type
        });
    }
};

/***/ })
/******/ ]);
});