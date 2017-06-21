'use strict';

const {
    View
} = require('./view');

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