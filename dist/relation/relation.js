"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const meta_manager_1 = require("../meta/meta.manager");
const meta_data_1 = require("../meta/meta.data");
const relation_types_1 = require("./relation.types");
const model_helper_1 = require("../model/model.helper");
function Relation(target, definition) {
    return function (source, property) {
        let relation = new ModelRelation(source, target, definition);
        let metaData = {
            type: meta_data_1.MetaDataTypes.relation,
            target: source,
            property: property,
            value: relation
        };
        meta_manager_1.MetaManager.set(source, metaData);
    };
}
exports.Relation = Relation;
class ModelRelation {
    constructor(model, target, definition) {
        this.targets = [];
        this.model = model;
        if (Array.isArray(target)) {
            target.forEach(current => this.targets.push(new current()));
        }
        else {
            this.targets = [new target()];
        }
        if (definition.type === relation_types_1.RelationTypes.one2n && !definition.relationKeys) {
            throw new Error('A relation from type one2n needs a relation keys definition.');
        }
        this.definition = definition;
        this.defineLinkins();
        this.defineRelation();
    }
    /**
     * initialise the linking properties
     */
    defineLinkins() {
        let defaultLinking = this.definition.linking || relation_types_1.LinkTypes.auto;
        if (!this.definition.linkings) {
            this.definition.linkings = {
                create: defaultLinking,
                read: defaultLinking,
                update: defaultLinking,
                remove: defaultLinking
            };
        }
        this.definition.linkings.create = this.definition.linkings.create || defaultLinking;
        this.definition.linkings.read = this.definition.linkings.read || defaultLinking;
        this.definition.linkings.update = this.definition.linkings.update || defaultLinking;
        this.definition.linkings.remove = this.definition.linkings.remove || defaultLinking;
    }
    /**
     * inititalise the relation property
     */
    defineRelation() {
        if (this.definition.type === relation_types_1.RelationTypes.one2one
            || this.definition.type === relation_types_1.RelationTypes.one2n) {
            this.relation = {};
        }
        else {
            this.relation = [];
        }
    }
    /**
     * checks if the data include the relation keys
     * @param data
     * @param target
     */
    keysInData(data, target) {
        return __awaiter(this, void 0, void 0, function* () {
            let keys = yield target.getKeys();
            if (keys.find((key) => data[key])) {
                return true;
            }
            else {
                return false;
            }
        });
    }
    removeModelKey(value) {
        return (~value.indexOf('.')) ? value.split('.')[1] : value;
    }
    /**
     * removes the model keys from data
     * @param data
     */
    removeModelKeys(data) {
        let output = {};
        for (let prop in data) {
            if (data.hasOwnProperty(prop)) {
                let key = this.removeModelKey(prop);
                output[key] = data[prop];
            }
        }
        return output;
    }
    /**
     * creates a reference from data and target
     * @param data
     * @param target
     */
    getKeyValueReference(data, target) {
        return __awaiter(this, void 0, void 0, function* () {
            let keys;
            if (this.definition.relationKeys) {
                keys = this.definition.relationKeys;
            }
            else {
                keys = yield target.getKeys();
            }
            let values = {};
            let modelName = target.getName();
            keys.forEach(key => {
                values[modelName + '.' + key] = data[key];
            });
            return values;
        });
    }
    /**
     * returns the target from the key name
     * @param data
     */
    getTarget(data) {
        if (this.targets.length === 1) {
            return this.targets[0];
        }
        for (let prop in data) {
            if (data.hasOwnProperty(prop) && ~prop.indexOf('.')) {
                let name = prop.split('.')[0];
                let target = this.targets.find((target) => {
                    return name === target.getName();
                });
                if (target) {
                    return target;
                }
                else {
                    throw new Error('Target model "' + name + '" not found!');
                }
            }
        }
    }
    /**
     * checks the linkingtype for create
     * @param data
     * @param linking
     * @param target
     */
    isCreatLinkReference(data, linking, target) {
        return __awaiter(this, void 0, void 0, function* () {
            switch (linking) {
                case relation_types_1.LinkTypes.auto:
                    return yield this.keysInData(data, target);
                case relation_types_1.LinkTypes.deep:
                    return false;
                case relation_types_1.LinkTypes.reference:
                    return false;
            }
        });
    }
    /**
     * creates an relation entry
     * @param data
     */
    create(data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let target, isReference, keyValueReference;
                switch (this.definition.type) {
                    case relation_types_1.RelationTypes.one2one:
                        target = this.getTarget(data);
                        data = this.removeModelKeys(data);
                        isReference = yield this.isCreatLinkReference(data, this.definition.linkings.create, target);
                        if (isReference) {
                            keyValueReference = yield this.getKeyValueReference(data, target);
                        }
                        else {
                            let result = yield target.create(data);
                            keyValueReference = yield this.getKeyValueReference(result, target);
                        }
                        return keyValueReference;
                    case relation_types_1.RelationTypes.one2n:
                        //the relation key(s) shouldn't be autoindex
                        if (!Array.isArray(data)) {
                            throw new Error('Data of one2n relation must be an array!');
                        }
                        target = this.getTarget(data[0]);
                        data = data.map(this.removeModelKeys.bind(this));
                        isReference = yield this.isCreatLinkReference(data[0], this.definition.linkings.create, target);
                        keyValueReference = yield this.getKeyValueReference(data[0], target);
                        if (!isReference) {
                            for (let entry of data) {
                                let result = yield target.create(entry);
                            }
                        }
                        return keyValueReference;
                    case relation_types_1.RelationTypes.m2n:
                        let results = [];
                        if (!Array.isArray(data)) {
                            throw new Error('Data of m2n relation must be an array!');
                        }
                        for (let entry of data) {
                            target = this.getTarget(entry);
                            data = data.map(this.removeModelKeys.bind(this));
                            isReference = yield this.isCreatLinkReference(entry, this.definition.linkings.create, target);
                            keyValueReference = yield this.getKeyValueReference(entry, target);
                            if (!isReference) {
                                let created = yield target.create(this.removeModelKeys(entry));
                                let outPutRef = yield this.getKeyValueReference(created, target);
                                results.push(outPutRef);
                            }
                        }
                        return results;
                    default:
                        throw new Error('Relation method "create" is not implemented for type "' + this.definition.type + '"');
                }
            }
            catch (e) {
                throw e;
            }
        });
    }
    /**
     * removes the model prefix from the model data properties
     * @param relationData
     */
    removePrefix(relationData) {
        let output = {};
        for (let prop in relationData) {
            if (relationData.hasOwnProperty(prop)) {
                let newPropName = (~prop.indexOf('.')) ? prop.split('.')[1] : prop;
                output[newPropName] = relationData[prop];
            }
        }
        return output;
    }
    getResourceCondition(resource) {
        resource = this.removeModelKeys(resource);
        return (entry) => {
            for (let prop in resource) {
                if (resource.hasOwnProperty(prop) && entry[prop] !== resource[prop]) {
                    return false;
                }
            }
            return true;
        };
    }
    addModelKey(data, key) {
        let output = {};
        for (let prop in data) {
            if (data.hasOwnProperty(prop)) {
                output[(!~prop.indexOf('.')) ? key + '.' + prop : prop] = data[prop];
            }
        }
        return output;
    }
    /**
     * reads a relation resource
     * @param resource
     */
    read(resource, withModelKeys = false) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let target, query;
                switch (this.definition.type) {
                    case relation_types_1.RelationTypes.one2one:
                        target = this.getTarget(resource);
                        if (withModelKeys) {
                            return yield target.read(resource, true);
                        }
                        return yield target.read(this.removeModelKeys(resource));
                    case relation_types_1.RelationTypes.one2n:
                        target = this.getTarget(resource);
                        let result = yield target.read(this.getResourceCondition(resource));
                        return result;
                    case relation_types_1.RelationTypes.m2n:
                        let output = [];
                        for (let entry of resource) {
                            target = this.getTarget(entry);
                            let condition = this.getResourceCondition(entry);
                            let result = yield target.read(condition, true);
                            let modelKey = model_helper_1.ModelHelper.getModelKey(entry);
                            if (withModelKeys) {
                                result = this.addModelKey(result, modelKey);
                            }
                            output.push(result);
                        }
                        return output;
                    default:
                        throw new Error('Relation method "read" is not implemented for type "' + this.definition.type + '"');
                }
            }
            catch (e) {
                throw e;
            }
        });
    }
    /**
     * checks the linking type for an update
     * @param data
     * @param linking
     * @param target
     */
    isUpdateLinkReference(data, linking, target) {
        switch (linking) {
            case relation_types_1.LinkTypes.auto:
            case relation_types_1.LinkTypes.deep:
                return false;
            case relation_types_1.LinkTypes.reference:
                return true;
        }
    }
    /**
     * updates an reference entry
     * @param data
     */
    update(data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let target, isReference, keyValueReference;
                switch (this.definition.type) {
                    case relation_types_1.RelationTypes.one2one:
                        target = this.getTarget(data);
                        isReference = this.isUpdateLinkReference(data, this.definition.linkings.update, target);
                        data = this.removeModelKeys(data);
                        keyValueReference = yield this.getKeyValueReference(data, target);
                        if (isReference) {
                            return keyValueReference;
                        }
                        else {
                            let updateResult = yield target.update(this.removeModelKeys(keyValueReference), data);
                            return keyValueReference;
                        }
                    case relation_types_1.RelationTypes.one2n:
                        if (data.length) {
                            target = this.getTarget(data[0]);
                            keyValueReference = yield this.getKeyValueReference(data[0], target);
                            if (!this.isUpdateLinkReference(data[0], this.definition.linkings.update, target)) {
                                for (let entry of data) {
                                    let ref = this.removeModelKeys(entry);
                                    let result = yield target.update(ref, entry);
                                }
                            }
                            return keyValueReference;
                        }
                        return null;
                    case relation_types_1.RelationTypes.m2n:
                        let output = [];
                        if (data.length) {
                            for (let entry of data) {
                                let target = this.getTarget(entry);
                                entry = this.removeModelKeys(entry);
                                let keyValueReference = yield this.getKeyValueReference(entry, target);
                                if (!this.isUpdateLinkReference(entry, this.definition.linkings.update, target)) {
                                    let result = yield target.update(keyValueReference, entry);
                                }
                                output.push(keyValueReference);
                            }
                        }
                        return output;
                    default:
                        throw new Error('Relation method "update" is not implemented for type "' + this.definition.type + '"');
                }
            }
            catch (e) {
                throw e;
            }
        });
    }
    /**
     * checks the linking type of a remove call
     * @param resource
     * @param linking
     * @param target
     */
    isRemoveLinkReference(resource, linking, target) {
        switch (linking) {
            case relation_types_1.LinkTypes.deep:
                return false;
            case relation_types_1.LinkTypes.reference:
                return true;
            default:
                throw new Error('Linking type "' + linking + '" is not impemented for remove relation.');
        }
    }
    /**
     * removes a relation entry
     * @param resource
     */
    remove(resource) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let isReference, target;
                switch (this.definition.type) {
                    case relation_types_1.RelationTypes.one2one:
                        target = this.getTarget(resource);
                        isReference = this.isRemoveLinkReference(resource, this.definition.linkings.remove, target);
                        if (!isReference) {
                            let keyValueReference = yield this.getKeyValueReference(this.removeModelKeys(resource), target);
                            return yield target.remove(keyValueReference);
                        }
                        return true;
                    case relation_types_1.RelationTypes.one2n:
                        target = this.getTarget(resource);
                        isReference = this.isRemoveLinkReference(resource, this.definition.linkings.remove, target);
                        if (!isReference) {
                            return yield target.remove(this.getResourceCondition(resource));
                        }
                        return true;
                    case relation_types_1.RelationTypes.m2n:
                        for (let singleResource of resource) {
                            target = this.getTarget(singleResource);
                            isReference = this.isRemoveLinkReference(singleResource, this.definition.linkings.remove, target);
                            if (!isReference) {
                                yield target.remove(this.getResourceCondition(singleResource));
                            }
                        }
                        return true;
                    default:
                        throw new Error('Relation method "remove" is not implemented for type "' + this.definition.type + '"');
                }
            }
            catch (e) {
                throw e;
            }
        });
    }
}
exports.ModelRelation = ModelRelation;
//# sourceMappingURL=relation.js.map