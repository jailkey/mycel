"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ModelManager {
    constructor(parent) {
        this.models = {};
        this.parent = parent;
    }
    register(model) {
        let vmodel = model;
        let name = vmodel.__name || vmodel.name;
        this.models[name] = new model();
        return this;
    }
    get(model) {
        if (this.models[model.name]) {
            return this.models[model.name];
        }
        throw new Error('Model "' + model.name + '" is not registerd!');
    }
    unregister(model) {
        delete this.models[model.name];
        return this;
    }
    getByName(name) {
        return this.models[name] || null;
    }
}
exports.ModelManager = ModelManager;
//# sourceMappingURL=controller.model.manager.js.map