const configuration = require('./configuration');

/**
 * Get attribute RegExp.
 * @return {String}
 */
export const getAttributeRegExp = function getAttributeRegExp() {
    const {
        prefix
    } = configuration;

    return new RegExp(`${prefix}-`);
};

/**
 * Get interpolation RegExp.
 * @return {Object}
 */
export const getInterpolationRegExp = function getInterpolationRegExp() {
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
export const parseAttributes = function parseAttributes(attributes, regExp) {
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
            };
        });
};

/**
 * Parse keypath.
 * @param {Object}
 * @return {Object}
 */
export const parseKeypath = function parseKeypath({
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
        key,
        obj,
        val
    };
};

/**
 * Parse node.
 * @param {Object} node - Node. 
 * @return {Object}
 */
export const parseNode = function parseNode(node) {
    const {
        attributes,
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
};

/**
 * Parse text node to find expressions.
 * @param {String} textContent - Node text content.
 * @param {String} regExp - Regular expression.
 */
export const parseTextNode = function parseTextNode(textContent, regExp) {
    const binder = 'text';

    if (regExp.test(textContent)) {
        const value = textContent.trim().match(regExp)[1];

        return [{
            binder,
            value
        }];
    }
};