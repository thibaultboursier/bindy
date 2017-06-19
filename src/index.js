'use strict';

const {View} = require('./view');

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
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Bindy;
    window.Bindy = Bindy;
} else if (typeof define === 'function' && define.amd) {
    define([], function () {
        return this.Bindy = Bindy;
    })
} else {
    this.Bindy = Bindy;
}