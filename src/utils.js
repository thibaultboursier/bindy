/**
 * Error handler.
 * @param {String} message - Message to print.
 */
export const error = function error(message) {
    throw new Error(`[bindy] ${message}`);
};