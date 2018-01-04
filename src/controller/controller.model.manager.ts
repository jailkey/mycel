import { Model } from '../model/model';

export class ModelManager {
    constructor(parent) {
        this.parent = parent;
    }

    private parent : any;

    private models : {};

    public register<T extends typeof Model>(model : T) : ModelManager {
        this.models[model.name] = model;
        return this;
    }

    public get<T>(model : new() => T) : T {
        if(this.models[model.name]){
            return new this.models[model.name]();
        }
        throw new Error('Model "' + model.name + '" is not registerd!');
    }

    public unregister<T extends typeof Model>(model : T) : ModelManager {
        delete this.models[model.name];
        return this;
    }
}