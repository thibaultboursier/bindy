const View = require('./view');
const parser = require('./parser');
const template = require('./template');

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
    },
    /**
     * For binder.
     * @param {Object} node - Node. 
     * @param {String} value - Value.
     */
    for (node, value) {
        const {
            target
        } = this;
        const {
            parentNode
        } = node;
        // Parsing for-of.
        const parsing = parser.parseForOf({
            target,
            value
        });
        const blocks = template.createBlocks({
            node,
            parsing
        });

        // Iterate over each template block,
        // and instanciate a new view.
        blocks.forEach(({
            DOM,
            target
        }) => {
            const view = new View.View(target, DOM);

            parentNode.insertBefore(DOM, node);
            view.init();
        });

        parentNode.removeChild(node);
    }
};