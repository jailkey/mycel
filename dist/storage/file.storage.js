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
const fs_1 = require("fs");
const storage_query_1 = require("./storage.query");
class FileStorage {
    constructor(options) {
        this.options = options;
    }
    getFilePermissions() {
        if (this.options.permissions.read && this.options.permissions.write) {
            return 'w+';
        }
        return 'r';
    }
    getFilePath() {
        return this.options.path + '/' + this.options.name + '.json';
    }
    fileExists() {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve) => {
                fs_1.exists(this.getFilePath(), resolve);
            });
        });
    }
    openFile() {
        return new Promise((resolve, reject) => {
            fs_1.open(this.getFilePath(), this.getFilePermissions(), (error) => {
                if (error) {
                    reject(error);
                    return;
                }
                resolve(true);
            });
        });
    }
    readFile() {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            try {
                if (this.options.permissions.read) {
                    let exists = yield this.fileExists();
                    if (!exists) {
                        resolve([]);
                    }
                    else {
                        fs_1.readFile(this.getFilePath(), 'utf8', (err, data) => {
                            if (err) {
                                reject(err);
                                return;
                            }
                            if (data.trim()) {
                                try {
                                    let output = JSON.parse(data);
                                    resolve(output);
                                }
                                catch (e) {
                                    resolve([]);
                                }
                            }
                            else {
                                resolve([]);
                            }
                        });
                    }
                }
                else {
                    reject(new Error('You do not have permissions to read the file "' + this.getFilePath() + '".'));
                }
            }
            catch (e) {
                reject(e);
            }
        }));
    }
    writeFile(data) {
        return new Promise((resolve, reject) => {
            try {
                if (this.options.permissions.write) {
                    fs_1.writeFile(this.getFilePath(), JSON.stringify(data, null, 2), (err) => {
                        if (err) {
                            reject(err);
                            return;
                        }
                        resolve(true);
                    });
                }
                else {
                    reject(new Error('You do not have permissions to write the file "' + this.getFilePath() + '".'));
                }
            }
            catch (e) {
                reject(e);
            }
        });
    }
    autoIncrement(fileData, property) {
        if (!fileData.length) {
            return 0;
        }
        let result = fileData.reduce((previous, current) => {
            return (previous[property] > current[property]) ? previous : current;
        });
        let increment = result[property];
        return ++increment;
    }
    findKey(resource, data) {
        return data.filter((current) => {
            let found = true;
            if (typeof resource === 'function') {
                found = resource(current);
            }
            else {
                for (let key of Object.keys(resource)) {
                    if (current[key] !== resource[key]) {
                        found = false;
                    }
                }
            }
            return found;
        });
    }
    addData(data, enty) {
        let savedData = {};
        for (let property of enty) {
            let value = (property.autoIncrement)
                ? this.autoIncrement(data, property.name)
                : property.value;
            savedData[property.name] = value;
        }
        data.push(savedData);
        return savedData;
    }
    /**
     * creates a new entry with the given data
     * @param data
     */
    create(data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let fileData = yield this.readFile();
                let output;
                if (Array.isArray(data[0])) {
                    output = [];
                    for (let entry of data) {
                        output.push(this.addData(fileData, entry));
                    }
                }
                else {
                    output = this.addData(fileData, data);
                }
                yield this.writeFile(fileData);
                return output;
            }
            catch (e) {
                throw e;
            }
        });
    }
    /**
     * reads an entry by the resource RessourceAccessKey
     * @param resourceId
     */
    read(ressource) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let fileData = yield this.readFile();
                let foundRead = this.findKey(ressource, fileData);
                return (!foundRead.length)
                    ? null
                    : (foundRead.length === 1)
                        ? foundRead[0]
                        : foundRead;
            }
            catch (e) {
                throw e;
            }
        });
    }
    updateEntry(resource, data) {
    }
    /**
     * updates an entry by RessourceAccessKey
     * @param resourceId
     * @param data
     */
    update(resource, data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let fileData = yield this.readFile();
                for (let i = 0; i < fileData.length; i++) {
                    let found = true;
                    if (typeof resource === 'function') {
                        found = resource(fileData[i]);
                    }
                    else {
                        for (let key of Object.keys(resource)) {
                            if (fileData[i][key] !== resource[key]) {
                                found = false;
                            }
                        }
                    }
                    if (found) {
                        for (let y = 0; y < data.length; y++) {
                            fileData[i][data[y].name] = data[y].value;
                        }
                        yield this.writeFile(fileData);
                        return true;
                    }
                }
            }
            catch (e) {
                throw e;
            }
        });
    }
    /**
     * removes an entry by a RessourceAccessKey
     * @param resourceId
     */
    remove(resource) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let fileData = yield this.readFile();
                let output = fileData.filter((current) => {
                    let found = true;
                    if (typeof resource === 'function') {
                        found = resource(current);
                    }
                    else {
                        for (let key of Object.keys(resource)) {
                            if (current[key] !== resource[key]) {
                                found = false;
                            }
                        }
                    }
                    return !found;
                });
                yield this.writeFile(output);
                return true;
            }
            catch (e) {
                throw e;
            }
        });
    }
    /**
     * deletes all entries from the storage
     */
    reset() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.writeFile([]);
                return true;
            }
            catch (e) {
                throw e;
            }
        });
    }
    createFilter(query, filter = [], filterIndex = 0) {
        if (!filter.length) {
            filter[filterIndex] = [];
        }
        if (query.filter && (!query.type || query.type === storage_query_1.QueryConditionTypes.and)) {
            filter[filterIndex].push({
                filter: query.filter,
                query: query
            });
        }
        if (query.filter && (query.type && query.type === storage_query_1.QueryConditionTypes.or)) {
            filterIndex++;
            filter[filterIndex] = [];
            filter[filterIndex].push({
                filter: query.filter,
                query: query
            });
        }
        if (query.child) {
            return this.createFilter(query.child, filter, filterIndex);
        }
        return filter;
    }
    createListCondition(listData) {
        let output = {};
        for (let listEntry of listData) {
            let condition = {};
            condition.type = storage_query_1.QueryConditionTypes.or;
            condition.filter = (entry) => {
                let result = false;
                for (let prop in listEntry) {
                    if (listEntry.hasOwnProperty(prop)) {
                        if (entry[prop] === listEntry[prop]) {
                            result = true;
                        }
                        else {
                            return false;
                        }
                    }
                }
                return result;
            };
            if (output.child) {
                output.child = condition;
                output = output.child;
            }
            else {
                output = condition;
            }
        }
        return output;
    }
    readFiltered(data, filter) {
        return data.filter((entry) => {
            for (let i = 0; i < filter.length; i++) {
                let result = true;
                for (let y = 0; y < filter[i].length; y++) {
                    if (!(filter[i][y].filter(entry))) {
                        result = false;
                        break;
                    }
                }
                if (result) {
                    return result;
                }
            }
            return false;
        });
    }
    updateFiltered(data, filter) {
        let updated = [];
        let createData = [];
        for (let i = 0; i < data.length; i++) {
            for (let y = 0; y < filter.length; y++) {
                let result = true;
                let updateData, notFound;
                for (let x = 0; x < filter[y].length; x++) {
                    if (!(filter[y][x].filter(data[i]))) {
                        result = false;
                        notFound = filter[y][x].query.data;
                    }
                    else {
                        if (Array.isArray(filter[y][x].query.data)) {
                            updateData = filter[y][x].query.data.map((entry) => {
                                let output = {};
                                output[entry.name] = entry.value;
                                return output;
                            });
                        }
                        else {
                            let output = {};
                            output[filter[y][x].query.data.name] = filter[y][x].query.data.value;
                            updateData = output;
                        }
                    }
                }
                if (result) {
                    data[i] = Object.assign({}, data[i], updateData);
                }
                else {
                    createData.push(notFound);
                }
            }
        }
        return data;
    }
    query(storageQuery) {
        return __awaiter(this, void 0, void 0, function* () {
            let fileData = yield this.readFile();
            let query = storageQuery.getQuery();
            let condition, filter, result;
            switch (query.action) {
                case storage_query_1.QueryActions.read:
                    condition = (query.list && query.list.length)
                        ? this.createListCondition(query.list)
                        : query.condition;
                    filter = this.createFilter(condition);
                    result = this.readFiltered(fileData, filter);
                    return result;
                case storage_query_1.QueryActions.update:
                    condition = query.condition;
                    filter = this.createFilter(condition);
                    result = this.updateFiltered(fileData, filter);
                    this.writeFile(result);
                    return true;
            }
            return [];
        });
    }
}
exports.FileStorage = FileStorage;
//# sourceMappingURL=file.storage.js.map