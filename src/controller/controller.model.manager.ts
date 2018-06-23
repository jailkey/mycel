/*

import { Model } from '../model/model.protoytpe';

export class ModelManager {
    constructor(parent) {
        this.parent = parent;
    }

    private parent : any;

    private models : any = {};

    public register<T extends typeof Model>(model : T) : ModelManager {
        let vmodel = model as any;
        let name = vmodel.__name || vmodel.name;
        this.models[name] = new model();
        return this;
    }

    public get<T>(model : new() => T) : T {
        if(this.models[model.name]){
            return this.models[model.name];
        }
        throw new Error('Model "' + model.name + '" is not registerd!');
    }

    public unregister<T extends typeof Model>(model : T) : ModelManager {
        delete this.models[model.name];
        return this;
    }

    public getByName(name : string){
        return this.models[name] || null;
    }
}
*/