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
const validation_message_1 = require("../validation/validation.message");
const validator_1 = require("../validation/validator");
const model_validation_error_1 = require("./model.validation.error");
const command_manager_1 = require("../command/command.manager");
const model_helper_1 = require("./model.helper");
class ModelPropertyData {
    constructor(name, value, options) {
        this.validations = [];
        this.index = false;
        this.autoIncrement = false;
        this.key = false;
        this.relation = null;
        this.name = name;
        this.value = value;
        if (options) {
            this.validations = options.validations || [];
            this.index = options.index || false;
            this.autoIncrement = options.autoIncrement || false;
            this.key = options.key || false;
            this.relation = options.relation || null;
        }
    }
}
exports.ModelPropertyData = ModelPropertyData;
class Model {
    constructor() {
        this.__commands = new command_manager_1.CommandManager();
        meta_manager_1.MetaManager.execute(this);
    }
    presentations() {
        return;
    }
    validations() {
        return;
    }
    getName() {
        return this.constructor.name;
    }
    /**
     * validate a property by its name
     * @param propertyName
     * @param value an optional validation value, used to validate incoming update values
     */
    validateProperty(propertyName, value) {
        return __awaiter(this, void 0, void 0, function* () {
            let data = this.getProperty(propertyName);
            if (!data) {
                return [];
            }
            let validationMessages = [];
            for (let validation of data.validations) {
                value = (value !== undefined) ? value : data.value;
                validationMessages.push(yield validator_1.Validator.validate(value, validation.value, this.getName(), propertyName));
            }
            if (validationMessages.length) {
                return validationMessages;
            }
            return [new validation_message_1.ValidationMessage(validation_message_1.ValidationMessageStates.success)];
        });
    }
    hasErrors(messages) {
        for (let entry of messages) {
            if (entry.state === validation_message_1.ValidationMessageStates.error) {
                return true;
            }
        }
        return false;
    }
    getPropertyNames() {
        let propertieNames = Reflect.ownKeys(this);
        return propertieNames.filter((current) => {
            return !current.startsWith('_');
        });
    }
    getKeys() {
        return __awaiter(this, void 0, void 0, function* () {
            let properties = yield this.properties();
            let keys = properties
                .filter((current) => current.key)
                .map((current) => current.name);
            if (!keys.length) {
                throw new Error('No Keys for model "' + this.constructor.name + "' specified!");
            }
            return keys;
        });
    }
    getRelations() {
        return __awaiter(this, void 0, void 0, function* () {
            let properties = yield this.properties();
            let relations = properties
                .filter((current) => current.relation)
                .map((current) => current.name);
            return relations;
        });
    }
    /**
     * validates the complete model
     * @param data if data is defined this values will used for validation
     */
    validate(data) {
        return __awaiter(this, void 0, void 0, function* () {
            let propertieNames = this.getPropertyNames();
            let propertyListMessageList = {};
            let isValid = true;
            if (!propertieNames.length) {
                throw new Error('The model "' + this.constructor.name + '" has no defined properties. Maybe you forgot to define a default value');
            }
            for (let propertyName of propertieNames) {
                propertyListMessageList[propertyName] = {
                    isValid: false,
                    messages: []
                };
                let value = (data && data[propertyName]) ? data[propertyName] : null;
                let validationMessage = yield this.validateProperty(propertyName, value);
                propertyListMessageList[propertyName].messages = propertyListMessageList[propertyName].messages.concat(validationMessage);
                propertyListMessageList[propertyName].isValid = !this.hasErrors(propertyListMessageList[propertyName].messages);
                if (!propertyListMessageList[propertyName].isValid) {
                    isValid = false;
                }
            }
            return {
                isValid: isValid,
                properties: propertyListMessageList
            };
        });
    }
    convertToResourceAccessKey(data, withModelKey = false) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let output = {};
                let keys = yield this.getKeys();
                if (!withModelKey) {
                    data = model_helper_1.ModelHelper.removeModelKeys(data);
                }
                for (let key of keys) {
                    if (!data.hasOwnProperty(key)) {
                        throw new Error('Can not convert data to RessourceAccessKey, because the data has not property "' + key + '"');
                    }
                    output[key] = data[key];
                }
                return output;
            }
            catch (e) {
                throw e;
            }
        });
    }
    /**
    * filters metadata by propertyName and metadata type
    * @param propertyName
    * @param type
    * @returns returns an array of metadata
    */
    getMetaData(propertyName, type) {
        return meta_manager_1.MetaManager.get(this).filter((current) => {
            return current.property === propertyName
                && current.type === type;
        });
    }
    getFirstMetaData(propertyName, type) {
        let metaData = this.getMetaData(propertyName, type);
        if (metaData.length) {
            return metaData[0];
        }
        return null;
    }
    /**
     * gets a property, with metadata by its propertyName
     * @param propertyName
     */
    getProperty(propertyName) {
        if (!propertyName.startsWith('_') && typeof propertyName !== 'function') {
            let autoIncrement = this.getFirstMetaData(propertyName, meta_data_1.MetaDataTypes.autoIncrement);
            let index = this.getFirstMetaData(propertyName, meta_data_1.MetaDataTypes.index);
            let key = this.getFirstMetaData(propertyName, meta_data_1.MetaDataTypes.key);
            let relation = this.getFirstMetaData(propertyName, meta_data_1.MetaDataTypes.relation);
            return new ModelPropertyData(propertyName, this[propertyName], {
                validations: this.getMetaData(propertyName, meta_data_1.MetaDataTypes.validation),
                autoIncrement: (autoIncrement) ? autoIncrement.value : false,
                index: (index) ? index.value : false,
                key: (key) ? key.value : false,
                relation: (relation) ? relation.value : null
            });
        }
        return null;
    }
    getQueryFilterFromData(data) {
        return (entry) => {
            for (let i = 0; i < data.length; i++) {
                let result = false;
                for (let prop in data[i]) {
                    if (data[i].hasOwnProperty(prop)) {
                        result = (entry[prop] === data[i][prop]);
                    }
                }
                if (result) {
                    return true;
                }
            }
            return false;
        };
    }
    mergeResult(result, data, property) {
        for (let i = 0; i < result.length; i++) {
            result[i][property] = data[i];
        }
        return result;
    }
    /**
     * creates a new model entry
     * @param data and key / value object with the data
     * @throws throws an validation error if the data is not valid
     */
    create(data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (Array.isArray(data)) {
                    let output = [];
                    for (let entry of data) {
                        output.push(yield this.create(entry));
                    }
                    return output;
                }
                let validation = yield this.validate(data);
                if (!validation.isValid) {
                    throw new model_validation_error_1.ModelValidationError('Model "' + this.constructor.name + '" is not valid!', this.constructor.name, validation);
                }
                let propertyData = yield model_helper_1.ModelHelper.convertToModelPropertyData(data, this);
                //create relations
                for (let i = 0; i < propertyData.length; i++) {
                    if (propertyData[i].relation) {
                        if (data[propertyData[i].name] !== undefined) {
                            propertyData[i].value = yield propertyData[i].relation.create(data[propertyData[i].name]);
                        }
                    }
                }
                let result = yield this.__storage.create(propertyData);
                return result;
            }
            catch (e) {
                throw e;
            }
        });
    }
    isEmpty(value) {
        if (Array.isArray(value)) {
            if (!value.length) {
                return true;
            }
        }
    }
    readRelations(result, withModelKeys = false) {
        return __awaiter(this, void 0, void 0, function* () {
            let propertyData = yield model_helper_1.ModelHelper.convertToModelPropertyData(result, this);
            //read relations
            for (let i = 0; i < propertyData.length; i++) {
                if (propertyData[i].relation && result[propertyData[i].name] !== null) {
                    result[propertyData[i].name] = yield propertyData[i].relation.read(result[propertyData[i].name], withModelKeys);
                }
            }
            return result;
        });
    }
    /**
     * reads an entry by the given resource
     * @param resource
     */
    read(resource, withModelKeys = false) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (typeof resource !== 'function' && !Object.keys(resource).length) {
                    return null;
                }
                let accessKey = (typeof resource === 'function')
                    ? resource
                    : yield this.convertToResourceAccessKey(resource);
                let result = yield this.__storage.read(accessKey);
                if (!result) {
                    return null;
                }
                if (Array.isArray(result)) {
                    for (let i = 0; i < result.length; i++) {
                        result[i] = yield this.readRelations(result[i], withModelKeys);
                    }
                }
                else {
                    result = yield this.readRelations(result, withModelKeys);
                }
                return result;
            }
            catch (e) {
                throw e;
            }
        });
    }
    removeModelKeys(data) {
        let output = {};
        for (let prop in data) {
            if (data.hasOwnProperty(prop)) {
                let key = (~prop.indexOf('.')) ? prop.split('.')[1] : prop;
                output[key] = data[prop];
            }
        }
        return output;
    }
    getModelKey(data) {
        for (let prop in data) {
            if (~prop.indexOf('.')) {
                return prop.split('.')[0];
            }
        }
        return null;
    }
    getModelKeys(data) {
        if (Array.isArray(data)) {
            return data.map((current) => {
                return this.getModelKey(current);
            });
        }
        else {
            return this.getModelKey(data);
        }
    }
    getPropertyName(prop, relation) {
        return (relation) ? relation + '.' + prop : prop;
    }
    updateData(target, newData) {
        let modelKey = this.getModelKey(newData);
        //newData = this.removeModelKeys(newData);
        for (let prop in newData) {
            if (newData.hasOwnProperty(prop)) {
                if (Array.isArray(newData[prop])) {
                    /*
                    console.log("-------->", prop, newData,  target[prop])
                    throw new Error("Array is not implemented");
                    */
                    let output = [];
                    for (let i = 0; i < newData[prop].length; i++) {
                        target[prop][i] = this.updateData(target[prop][i], newData[prop][i]);
                        /*
                        for(let y = 0; y < target[prop].length; y++){
                         
                        }*/
                        //output.push(this.updateData(target[prop][i], )
                    }
                    //target[prop] = newData[prop];
                }
                else if (Array.isArray(target)) {
                    for (let i = 0; i < target.length; i++) {
                        if (typeof newData[prop] === 'object') {
                            target[i][prop] = this.updateData(target[i][prop], newData[prop]);
                        }
                        else {
                            target[i][prop] = newData[prop];
                        }
                    }
                }
                else if (typeof newData[prop] === 'object') {
                    target[prop] = this.updateData(target[prop], newData[prop]);
                }
                else {
                    target[prop] = newData[prop];
                }
            }
        }
        return target;
    }
    updateSingleRelation(currentData) {
        return __awaiter(this, void 0, void 0, function* () {
            let propertyData = yield model_helper_1.ModelHelper.convertToModelPropertyData(currentData, this);
            for (let i = 0; i < propertyData.length; i++) {
                if (propertyData[i].relation) {
                    propertyData[i].value = yield propertyData[i].relation.update(currentData[propertyData[i].name]);
                }
            }
            return propertyData;
        });
    }
    updateSingleEntry(currentData, data) {
        return __awaiter(this, void 0, void 0, function* () {
            currentData = this.updateData(currentData, data);
            let validation = yield this.validate(currentData);
            if (!validation.isValid) {
                throw new model_validation_error_1.ModelValidationError('Model "' + this.constructor.name + '" is not valid!', this.constructor.name, validation);
            }
            let propertyData;
            if (Array.isArray(currentData)) {
                propertyData = [];
                for (let entry of currentData) {
                    propertyData.push(yield this.updateSingleRelation(entry));
                }
            }
            else {
                propertyData = yield this.updateSingleRelation(currentData);
            }
            /*
            let propertyData = await ModelHelper.convertToModelPropertyData(currentData, this);
            for(let i = 0; i < propertyData.length; i++){
                if(propertyData[i].relation){
                    propertyData[i].value = await propertyData[i].relation.update(currentData[propertyData[i].name]);
                }
            }*/
            return propertyData;
        });
    }
    /**
     * updates an existing entry
     * @param resource
     * @param data
     * @throws throws an ModelValidationError if the data is not valid
     */
    update(resource, data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let currentData = yield this.read(resource, true);
                if (!currentData) {
                    return false;
                }
                let updatData;
                if (Array.isArray(currentData)) {
                    updatData = [];
                    for (let entry of currentData) {
                        updatData.push(yield this.updateSingleEntry(entry, data));
                    }
                }
                else {
                    updatData = yield this.updateSingleEntry(currentData, data);
                }
                let accessKey = (typeof resource === 'function')
                    ? resource
                    : yield this.convertToResourceAccessKey(resource);
                return this.__storage.update(accessKey, updatData);
            }
            catch (e) {
                throw e;
            }
        });
    }
    removeRelations(result) {
        return __awaiter(this, void 0, void 0, function* () {
            let propertyData = yield model_helper_1.ModelHelper.convertToModelPropertyData(result, this);
            //delete relations
            for (let i = 0; i < propertyData.length; i++) {
                if (propertyData[i].relation) {
                    propertyData[i].value = yield propertyData[i].relation.remove(result[propertyData[i].name]);
                }
            }
        });
    }
    /**
     * removes a resource
     * @param resource
     */
    remove(resource) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let accessKey = (typeof resource === 'function')
                    ? resource
                    : yield this.convertToResourceAccessKey(resource);
                let result = yield this.__storage.read(accessKey);
                if (Array.isArray(result)) {
                    for (let entry of result) {
                        if (entry) {
                            yield this.removeRelations(entry);
                        }
                    }
                }
                else {
                    if (result) {
                        yield this.removeRelations(result);
                    }
                }
                return this.__storage.remove(accessKey);
            }
            catch (e) {
                throw e;
            }
        });
    }
    /**
     * a list of alle model properties with its meta data
     */
    properties() {
        return __awaiter(this, void 0, void 0, function* () {
            let properties = [];
            let propertieNames = this.getPropertyNames();
            for (let prop of propertieNames) {
                prop = prop;
                let data = this.getProperty(prop);
                if (data) {
                    properties.push(data);
                }
            }
            return properties;
        });
    }
}
exports.Model = Model;
function ModelOptions(options) {
    return options;
}
exports.ModelOptions = ModelOptions;
function ModelFactory(model) {
    return new model;
}
exports.ModelFactory = ModelFactory;
//# sourceMappingURL=model.js.map