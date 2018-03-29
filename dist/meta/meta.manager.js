"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Manages meta data types initialiser functions
 */
class MetaTypeInitialiserClass {
    constructor() {
        this.initialiser = [];
    }
    /**
     * adds a new initialiser for a type
     * @param type
     * @param initialiser
     */
    set(type, initialiser) {
        this.initialiser.push({
            type: type,
            initialiser: initialiser
        });
    }
    /**
     * gets a initialiser from a type
     * @param type
     */
    get(type) {
        return this.initialiser.find(current => current.type === type);
    }
    /**
     * executes a initialiser for a type
     * @param target
     * @param data
     */
    execute(target, data) {
        let initialiser = this.get(data.type);
        if (!initialiser) {
            return;
            //throw new Error('No initialiser for type "' + data.type + "' found!");
        }
        return initialiser.initialiser(target, data);
    }
}
//a single instance is needed to store the data globally
exports.MetaTypeInitialiser = new MetaTypeInitialiserClass();
/**
 * Manages decorators metadata
 */
class MetaManager {
    /**
     * adds metadata to a class
     * @param target
     * @param data
     */
    static set(target, data) {
        target.__meta = target.__meta || [];
        target.__meta.push(data);
        return this;
    }
    /**
     * gets metadata from an instance
     * @param target
     */
    static get(target) {
        return target.__meta || [];
    }
    /**
     * executes all metadata related to an instance
     * @param target
     */
    static execute(target) {
        if (target.__meta) {
            target.__meta.forEach((data) => {
                exports.MetaTypeInitialiser.execute(target, data);
            });
        }
    }
}
exports.MetaManager = MetaManager;
//# sourceMappingURL=meta.manager.js.map