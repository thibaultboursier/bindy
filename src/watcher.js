/**
 * Class representing a watcher.
 */
export class Watcher {
    /**
     * Create a watcher.
     * @constructor
     */
    constructor() {
        this.registry = {};
    }

    /**
     * Watch object property and add it to registry.
     * @param {Object} obj 
     * @param {String} key 
     * @param {String} keypath 
     * @param {Function} callback 
     */
    watch(obj, key, keypath, callback) {
        const {
            registry
        } = this;
        const descriptor = Object.getOwnPropertyDescriptor(obj, key);

        // Add keypath if registry if it's not registered yet.
        if (!registry.hasOwnProperty(keypath)) {
            registry[keypath] = {};
            registry[keypath].callbacks = [];
        }

        registry[keypath].callbacks.push(callback);

        // Exit if setter exists.
        if (descriptor.hasOwnProperty('set')) {
            return;
        }

        Object.defineProperty(obj, key, {
            enumerable: true,
            set: (newVal) => {
                registry[keypath].val = newVal;
                registry[keypath].callbacks.forEach(callback => callback(newVal));
            },
            get: () => {
                return registry[keypath].val;
            }
        });
    }
}