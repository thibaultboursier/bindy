module.exports = {
    /**
     * Text binder.
     * @param {Object} node - Node. 
     * @param {String} value - Value.
     */
    text(node, value) {
        const type = 'property';

        this.register({
            node,
            keypath: value,
            type
        });
    },
    /**
     * Model binder.
     * @param {Object} node - Node. 
     * @param {String} value - Value.
     */
    model(node, value) {
        const type = 'event';

        this.register({
            node,
            keypath: value,
            type
        });
    }
};