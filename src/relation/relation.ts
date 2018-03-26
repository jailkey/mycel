import { Model } from '../model/model';
import { MetaManager, MetaTypeInitialiser } from '../meta/meta.manager';
import { MetaData, MetaDataTypes } from '../meta/meta.data';
import { RelationKeyTypes, RelationTypes, LinkTypes } from './relation.types';
import { ModelHelper } from '../model/model.helper';
import { E2BIG } from 'constants';

export interface RelationLinks {
    read : LinkTypes,
    create : LinkTypes,
    update : LinkTypes,
    remove : LinkTypes
}

export interface RelationDefinition{
    type : RelationTypes;
    //relationKeyType : RelationKeyTypes;
    relationKeys? : Array<string>;
    linkings? : RelationLinks;
    linking?: LinkTypes;
}


export function Relation(target : typeof Model | Array<typeof Model>, definition : RelationDefinition) : any{
    return function (source, property) {
        let relation = new ModelRelation(source, target, definition);

        let metaData : MetaData = {
            type : MetaDataTypes.relation,
            target : source,
            property : property,
            value : relation
        }

        MetaManager.set(source, metaData);
    }
}


export class ModelRelation {
    constructor(model : typeof Model, target : typeof Model | Array<typeof Model>, definition : RelationDefinition){ 
        this.model = model;

        if(Array.isArray(target)){
            target.forEach(current => this.targets.push(new current()));
        }else{
            this.targets = [new target()];
        }

        if(definition.type === RelationTypes.one2n && !definition.relationKeys){
            throw new Error('A relation from type one2n needs a relation keys definition.');
        }
        
        this.definition = definition;
        this.defineLinkins();
        this.defineRelation();
    }


    public model : typeof Model;
    public targets : Array<Model> = [];
    public type : RelationTypes;
    public relation : any;
    private definition : RelationDefinition;

    /**
     * initialise the linking properties
     */
    private defineLinkins(){
        let defaultLinking = this.definition.linking || LinkTypes.auto;
        if(!this.definition.linkings){
            this.definition.linkings = {
                create : defaultLinking,
                read : defaultLinking,
                update : defaultLinking,
                remove : defaultLinking
            }
        }
        this.definition.linkings.create = this.definition.linkings.create || defaultLinking
        this.definition.linkings.read = this.definition.linkings.read || defaultLinking;
        this.definition.linkings.update = this.definition.linkings.update || defaultLinking
        this.definition.linkings.remove = this.definition.linkings.remove || defaultLinking;
    }

    /**
     * inititalise the relation property
     */
    private defineRelation(){
        if(
            this.definition.type === RelationTypes.one2one 
            || this.definition.type === RelationTypes.one2n
        ){
            this.relation = {};
        }else{
            this.relation = [];
        }
    }

    /**
     * checks if the data include the relation keys
     * @param data
     * @param target 
     */
    private async keysInData(data : any, target : Model) : Promise<boolean>{
        let keys = await target.getKeys();
        if(keys.find((key) => data[key])){
            return true;
        }else{
            return false;
        }
    }

    private removeModelKey(value : string){
        return (~value.indexOf('.')) ? value.split('.')[1] : value;
    }

    /**
     * removes the model keys from data
     * @param data 
     */
    private removeModelKeys(data : any){
        let output = {};
        for(let prop in data){
            if(data.hasOwnProperty(prop)){
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
    private async getKeyValueReference(data : any, target : Model) : Promise<any>{
        let keys;
        if(this.definition.relationKeys){
            keys = this.definition.relationKeys; 
        }else{
            keys = await target.getKeys();
        }
        let values = {};
        let modelName = target.getName();
        keys.forEach(key => {
            values[modelName + '.' + key] = data[key];
        });
        return values;
    }

    /**
     * returns the target from the key name
     * @param data 
     */
    private getTarget(data : any) : Model{
        if(this.targets.length === 1){
            return this.targets[0];
        }
        for(let prop in data){
            if(data.hasOwnProperty(prop) && ~prop.indexOf('.')){
                let name = prop.split('.')[0];
                let target = this.targets.find((target) => {
                    return name === target.getName();
                });
                if(target){
                    return target;
                }else{
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
    private async isCreatLinkReference(data : any, linking : LinkTypes, target : Model){
        switch(linking){
            case LinkTypes.auto:
                return await this.keysInData(data,target);
            case LinkTypes.deep:
                return false;
            case LinkTypes.reference:
                return false;
        }
    }

    /**
     * creates an relation entry
     * @param data 
     */
    public async create(data : any){
        try {
            let target, isReference, keyValueReference;
            switch(this.definition.type){

                case RelationTypes.one2one:
                    target = this.getTarget(data);
                    data = this.removeModelKeys(data);
                    isReference = await this.isCreatLinkReference(data, this.definition.linkings.create, target);
                    if(isReference){
                        keyValueReference = await this.getKeyValueReference(data, target);
                    }else{
                        let result = await target.create(data);
                        keyValueReference = await this.getKeyValueReference(result, target);
                    }
                    return keyValueReference;

                case RelationTypes.one2n:
                    //the relation key(s) shouldn't be autoindex
                    if(!Array.isArray(data)){
                        throw new Error('Data of one2n relation must be an array!')
                    }
                    target = this.getTarget(data[0]);
                    data = data.map(this.removeModelKeys.bind(this));
                    isReference = await this.isCreatLinkReference(data[0], this.definition.linkings.create, target);
                    keyValueReference = await this.getKeyValueReference(data[0], target);
                    if(!isReference){
                        for(let entry of data){
                            let result = await target.create(entry);
                        }
                    }
                    return keyValueReference;

                case RelationTypes.m2n:
                    let results = [];
                    if(!Array.isArray(data)){
                        throw new Error('Data of m2n relation must be an array!')
                    }
                    for(let entry of data){
                        target = this.getTarget(entry);
                        data = data.map(this.removeModelKeys.bind(this));
                        isReference = await this.isCreatLinkReference(entry, this.definition.linkings.create, target);
                        keyValueReference = await this.getKeyValueReference(entry, target);
                        if(!isReference){
                            let created = await target.create(this.removeModelKeys(entry));
                            let outPutRef = await this.getKeyValueReference(created, target);
                            results.push(outPutRef);
                        }
                    }
                    return results;
                default: 
                    throw new Error('Relation method "create" is not implemented for type "' + this.definition.type + '"');
            }
        }catch(e) {
            throw e;
        }
    }

    /**
     * removes the model prefix from the model data properties
     * @param relationData 
     */
    private removePrefix(relationData : any){
        let output = {};
        for(let prop in relationData){
            if(relationData.hasOwnProperty(prop)){
                let newPropName = (~prop.indexOf('.')) ? prop.split('.')[1] : prop;
                output[newPropName] = relationData[prop];
            }
        }
        return output;
    }

    private getResourceCondition(resource : any){
        resource = this.removeModelKeys(resource);
        return (entry) => {
            for(let prop in resource){
                if(resource.hasOwnProperty(prop) && entry[prop] !== resource[prop]){
                   return false;
                }
            }
            return true;
        }
    }

    /**
     * reads a relation resource
     * @param resource 
     */
    public async read(resource : any, withRelations : boolean = false){
        try {
            let target, query;
            switch(this.definition.type){
                case RelationTypes.one2one:
                    target = this.getTarget(resource);
                    return await target.read(this.removeModelKeys(resource));

                case RelationTypes.one2n:
                    target = this.getTarget(resource);
                    let result = await target.read(this.getResourceCondition(resource))
                    return result;

                case RelationTypes.m2n:
                    let output = [];
                    for(let entry of resource){
                        target = this.getTarget(entry);
                        let condition = this.getResourceCondition(entry);
                        let result = await target.read(condition, true);
                        output.push(result);
                    }
                    return output;
                default:
                    throw new Error('Relation method "read" is not implemented for type "' + this.definition.type + '"');
            }
        }catch(e){
            throw e;
        }
    }

    /**
     * checks the linking type for an update
     * @param data 
     * @param linking 
     * @param target 
     */
    private isUpdateLinkReference(data : any, linking : LinkTypes, target : Model){
        switch(linking){
            case LinkTypes.auto:

            case LinkTypes.deep:
                return false;
            case LinkTypes.reference:
                return true;
        }
    }

    /**
     * updates an reference entry
     * @param data 
     */
    public async update(data : any){
        try {
            let target, isReference, keyValueReference;
            switch(this.definition.type){
                case RelationTypes.one2one:
                    target = this.getTarget(data);
                    isReference = this.isUpdateLinkReference(data, this.definition.linkings.update, target);
                    data = this.removeModelKeys(data);
                    keyValueReference = await this.getKeyValueReference(data, target);
                    if(isReference){
                        return keyValueReference;
                    }else{
                        let updateResult = await target.update(this.removeModelKeys(keyValueReference), data);
                        return keyValueReference;
                    }

                case RelationTypes.one2n:
                    if(data.length){
                        target = this.getTarget(data[0]);
                        keyValueReference = await this.getKeyValueReference(data[0], target);
                        if(!this.isUpdateLinkReference(data[0], this.definition.linkings.update, target)){
                            for(let entry of data){
                                let ref = this.removeModelKeys(entry);
                                let result = await target.update(ref, entry);
                            }
                        }
                        return keyValueReference;
                    }
                    return null;
                
                case RelationTypes.m2n:
                    let output = [];
                    if(data.length){
                        for(let entry of data){
                            let target = this.getTarget(entry);
                            entry = this.removeModelKeys(entry);
                            let keyValueReference = await this.getKeyValueReference(entry, target);
                            if(!this.isUpdateLinkReference(entry, this.definition.linkings.update, target)){
                                let result = await target.update(keyValueReference, entry);
                            }
                            output.push(keyValueReference);
                        }
                    }
                    return output;
                default:
                    throw new Error('Relation method "update" is not implemented for type "' + this.definition.type + '"'); 
            }
        }catch(e){
            throw e;
        }
    }

    /**
     * checks the linking type of a remove call
     * @param resource 
     * @param linking 
     * @param target 
     */
    private isRemoveLinkReference(resource : any, linking : LinkTypes, target : Model){
        switch(linking){
            case LinkTypes.deep:
                return false;
            case LinkTypes.reference:
                return true;
            default:
                throw new Error('Linking type "' + linking + '" is not impemented for remove relation.')
        }
    } 

    /**
     * removes a relation entry
     * @param resource 
     */
    public async remove(resource : any) {
        try {
            let isReference, target
            switch(this.definition.type){
                case RelationTypes.one2one:
                    target = this.getTarget(resource);
                    isReference = this.isRemoveLinkReference(resource, this.definition.linkings.remove, target)
                    if(!isReference){
                        let keyValueReference = await this.getKeyValueReference(this.removeModelKeys(resource), target);
                        return await target.remove(keyValueReference);
                    }
                    return true;
                case RelationTypes.one2n:
                  
                    target = this.getTarget(resource);
                    isReference = this.isRemoveLinkReference(resource, this.definition.linkings.remove, target)
                    if(!isReference){
                        return await target.remove(this.getResourceCondition(resource));
                    }
                    return true;
                default:
                    throw new Error('Relation method "remove" is not implemented for type "' + this.definition.type + '"');   
            }
        }catch(e){
            throw e;
        }
    }
}