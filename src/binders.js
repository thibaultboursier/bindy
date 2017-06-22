const utils = require('./utils');

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