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
var QueryActions;
(function (QueryActions) {
    QueryActions["create"] = "create";
    QueryActions["read"] = "read";
    QueryActions["update"] = "update";
    QueryActions["remove"] = "remove";
})(QueryActions = exports.QueryActions || (exports.QueryActions = {}));
var QueryConditionTypes;
(function (QueryConditionTypes) {
    QueryConditionTypes["and"] = "and";
    QueryConditionTypes["or"] = "or";
})(QueryConditionTypes = exports.QueryConditionTypes || (exports.QueryConditionTypes = {}));
var QueryConditionHandler;
(function (QueryConditionHandler) {
    QueryConditionHandler["equal"] = "equal";
    QueryConditionHandler["startsWith"] = "startWith";
    QueryConditionHandler["endsWith"] = "endsWith";
})(QueryConditionHandler = exports.QueryConditionHandler || (exports.QueryConditionHandler = {}));
class StorageQuery {
    constructor() { }
    ;
    addAction(action) {
        if (this.query) {
            throw new Error('Only one action per storage query is allowed!');
        }
        this.query = {
            action: action,
            condition: {}
        };
        this.nextCondition = this.query.condition;
    }
    checkAction() {
        if (!this.query.action) {
            throw new Error('Query action should be set befor a condition!');
        }
    }
    create() {
        this.addAction(QueryActions.create);
        return this;
    }
    read() {
        this.addAction(QueryActions.read);
        return this;
    }
    update() {
        this.addAction(QueryActions.update);
        return this;
    }
    remove() {
        this.addAction(QueryActions.update);
        return this;
    }
    set(data) {
        if (this.query.action !== QueryActions.create
            && this.query.action !== QueryActions.update) {
            throw new Error('Set query can not be used with action "' + this.query.action + '"!');
        }
        if (!this.lastCondition) {
            throw new Error('You can not use the "set" method without a condition!');
        }
        this.lastCondition.data = data;
        return this;
    }
    list(data) {
        if (this.nextCondition.type) {
            throw new Error('You can not use a ListQuery together with a condition!');
        }
        this.query.list = data;
        return this;
    }
    where(filter) {
        if (!filter || typeof filter !== 'function') {
            throw new Error('Filter in "where" condition is not defined!');
        }
        this.nextCondition.filter = filter;
        this.nextCondition.child = {};
        this.lastCondition = this.nextCondition;
        this.nextCondition = this.nextCondition.child;
        return this;
    }
    and(filter) {
        if (!filter || typeof filter !== 'function') {
            throw new Error('Filter in "and" condition is not defined!');
        }
        this.nextCondition.type = QueryConditionTypes.and;
        this.nextCondition.filter = filter;
        this.nextCondition.child = {};
        this.lastCondition = this.nextCondition;
        this.nextCondition = this.nextCondition.child;
        return this;
    }
    or(filter) {
        if (!filter || typeof filter !== 'function') {
            throw new Error('Filter in "or" condition is not defined!');
        }
        if (this.query.action === QueryActions.create) {
            throw new Error('You can not use "or" with a "create" action!');
        }
        this.nextCondition.type = QueryConditionTypes.or;
        this.nextCondition.filter = filter;
        this.nextCondition.child = {};
        this.lastCondition = this.nextCondition;
        this.nextCondition = this.nextCondition.child;
        return this;
    }
    getQuery() {
        return this.query;
    }
    modify(callback, condition) {
        return __awaiter(this, void 0, void 0, function* () {
            let output = [];
            if (!condition) {
                this.query.condition = yield callback(this.query.condition);
                condition = this.query.condition;
            }
            else {
                condition = yield callback(condition);
            }
            if (condition.child && Object.keys(condition.child).length) {
                condition.child = yield this.modify(callback, condition.child);
            }
            return condition;
        });
    }
    getChangedFields() {
        let getField = (condition, collected = []) => {
            if (condition.data) {
                for (let prop in condition.data) {
                    if (condition.data.hasOwnProperty(prop)) {
                        collected.push(prop);
                    }
                }
            }
            if (condition.child) {
                collected = collected.concat(getField(condition.child, collected));
            }
            return collected;
        };
        let output = getField(this.query.condition);
        return output.filter((current, index) => output.indexOf(current) === index);
    }
    copyAsReadable() {
        let newQuery = new StorageQuery();
        newQuery.read();
        let addConditions = (query, condition) => {
            if (condition.filter) {
                switch (condition.type) {
                    case QueryConditionTypes.and:
                        query.and(condition.filter);
                        break;
                    case QueryConditionTypes.or:
                        query.or(condition.filter);
                        break;
                    default:
                        query.where(condition.filter);
                        break;
                }
            }
            if (condition.child) {
                query = addConditions(query, condition.child);
            }
            return query;
        };
        return addConditions(newQuery, this.query.condition);
    }
}
exports.StorageQuery = StorageQuery;
//# sourceMappingURL=storage.query.js.map