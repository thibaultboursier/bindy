const configuration = require('./configuration');

/**
 * Create template blocks.
 * @param {Object}
 */
export const createBlocks = function createBlocks({
    node,
    parsing
}) {
    const {
        val,
        variable
    } = parsing;
    const forAttribute = `${configuration.prefix}-for`;
    const blocks = [];

    for (let item of val) {
        const target = {
            [variable]: item
        };
        const DOM = node.cloneNode(true);
        DOM.removeAttribute(forAttribute);

        blocks.push({
            DOM,
            target
        });
    }

    return blocks;
};