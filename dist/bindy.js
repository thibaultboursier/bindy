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
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _require = __webpack_require__(1),
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
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _require = __webpack_require__(2),
    Binding = _require.Binding;

var utils = __webpack_require__(4);

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

        this.prefix = 'bd';
        this.target = target;
        this.DOM = DOM;
        this.bindings = [];
        this.binders = {
            text: function text(el, value) {
                var keypath = value;
                var type = 'property';

                this.register({
                    el: el,
                    keypath: keypath,
                    type: type
                });
            },
            model: function model(el, value) {
                var keypath = value;
                var type = 'event';

                this.register({
                    el: el,
                    keypath: keypath,
                    type: type
                });
            }
        };
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
                error('Binding [' + key + '] is already registered.');
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
         * Get binding RegExp.
         * @return {String}
         */

    }, {
        key: 'getBindingRegExp',
        value: function getBindingRegExp() {
            return new RegExp(this.prefix + '-');
        }
    }, {
        key: 'getChildNodes',


        /**
         * Get child nodes.
         * @param {Object} node - Node.
         */
        value: function getChildNodes(node) {
            var _this = this;

            var bindingRegExp = this.getBindingRegExp();
            var attributes = node.attributes,
                childNodes = node.childNodes,
                nodeType = node.nodeType;

            var results = void 0;

            switch (nodeType) {
                case 1:
                    results = this.parseAttributes(attributes);
                    break;
                case 3:
                    results = this.parseTextNode(node);
                    break;
            }

            results && results.forEach(function (_ref) {
                var binder = _ref.binder,
                    value = _ref.value;
                return _this.binders[binder].call(_this, node, value);
            });

            // Call recursively getChildNodes method.
            childNodes.forEach(this.getChildNodes.bind(this));
        }

        /**
         * Parse attributes to find binders.
         */

    }, {
        key: 'parseAttributes',
        value: function parseAttributes(attributes) {
            var bindingRegExp = this.getBindingRegExp();

            return Array.from(attributes).filter(function (_ref2) {
                var name = _ref2.name;
                return bindingRegExp.test(name);
            }).map(function (_ref3) {
                var value = _ref3.value,
                    name = _ref3.name;

                var binder = name.replace(bindingRegExp, '');

                return {
                    binder: binder,
                    value: value
                };
            });
        }

        /**
         * Parse text node to find expressions.
         * @param {Object}
         */

    }, {
        key: 'parseTextNode',
        value: function parseTextNode(_ref4) {
            var textContent = _ref4.textContent;

            var binder = 'text';

            if (/{{(.*?)}}/.test(textContent)) {
                var value = textContent.trim().match(/{{(.*?)}}/)[1];

                return [{
                    binder: binder,
                    value: value
                }];
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
        value: function register(_ref5) {
            var el = _ref5.el,
                keypath = _ref5.keypath,
                type = _ref5.type;
            var DOM = this.DOM,
                target = this.target;

            var binding = new Binding({
                DOM: DOM,
                el: el,
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
            this.getChildNodes(this.DOM);

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
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var parser = __webpack_require__(3);

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
            el = _ref.el,
            keypath = _ref.keypath,
            target = _ref.target,
            type = _ref.type;

        _classCallCheck(this, Binding);

        Object.assign(this, {
            DOM: DOM,
            el: el,
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
            var el = this.el,
                key = this.key,
                keypath = this.keypath,
                obj = this.obj,
                target = this.target,
                val = this.val;

            var handler = function handler(event) {
                var value = event.target.value;

                obj[key] = value;
            };

            el.addEventListener('keyup', handler);
            el.addEventListener('keydown', handler);
            el.addEventListener('change', handler);

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
            var nodeType = this.el.nodeType;


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
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
/**
 * Parse keypath.
 * @param {Object}
 * @return {Object}
 */
var parseKeypath = exports.parseKeypath = function parseKeypath(_ref) {
    var keypath = _ref.keypath,
        target = _ref.target;

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
        obj: obj,
        key: key,
        val: val
    };
};

/***/ }),
/* 4 */
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

/***/ })
/******/ ]);
});