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
        obj,
        key,
        val
    };
};