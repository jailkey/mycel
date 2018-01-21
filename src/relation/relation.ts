import { Model } from '../model/model';
import { MetaManager, MetaTypeInitialiser } from '../meta/meta.manager';
import { MetaData, MetaDataTypes } from '../meta/meta.data';

export enum RelationTypes {
    one2one = 'one2one',
    one2n = 'one2n',
    m2n = 'm2n'
}

export enum RelationKeyTypes {
    list = 'List',
    auto = 'Auto'
}

export enum LinkTypes {
    deep = 'deep', //deletes relations / creates new entries in related table
    reference = 'reference', //create only references 
    auto = 'auto' //checks automaticly how to handle the relation
}

export const AutoRelation : string = 'AutoRelation';

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


export function Relation(target : typeof Model, definition : RelationDefinition) : any{
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
            target.forEach((current) => {
                this.targets.push(new current());
            });
        }else{
            this.targets = [new target()];
        }
        
        this.definition = definition;
        this.defineLinkins();
        this.defineRelation();
    }


    public model : typeof Model;
    public targets : Array<Model>;
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

    /**
     * removes the model keys from data
     * @param data 
     */
    private removeModelKeys(data : any){
        let output = {};
        for(let prop in data){
            if(data.hasOwnProperty(prop)){
                let key = (~prop.indexOf('.')) ? prop.split('.')[1] : prop;
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
    private async getKeyValueReference(data : any, target : Model){
        let keys = await target.getKeys();
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
    private getTarget(data : any){
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

        switch(this.definition.type){
            case RelationTypes.one2one:
            case RelationTypes.one2n:
                let target = this.getTarget(data);
                data = this.removeModelKeys(data);
                let isReference = await this.isCreatLinkReference(data, this.definition.linkings.create, target);
                let keyValueReference;
                if(isReference){
                    keyValueReference = await this.getKeyValueReference(data, target);
                }else{
                    let result = await target.create(data);
                    keyValueReference = await this.getKeyValueReference(result, target);
                }
                return keyValueReference;
            case RelationTypes.m2n:
            /*
                if(isReference){
                    let keyValueReference = await this.getKeyValueReference(data);
                    this.relation.push(keyValueReference);
                }else{
                    let result = await this.target.create(data);
                    let keyValueReference = await this.getKeyValueReference(result);
                    this.relation.push(keyValueReference);
                }
                return this.relation;
                */
            default: 
                throw new Error('Relation method "create" is not implemented for type "' + this.definition.type + '"');
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

    /**
     * reads a relation ressource
     * @param ressource 
     */
    public async read(ressource : any){
        switch(this.definition.type){
            case RelationTypes.one2one:
                let target = this.getTarget(ressource);
                return await target.read(this.removeModelKeys(ressource));
            case RelationTypes.m2n:
                let output = [];
                //TODO use query instead of single calls
                /*
                for(let relation of this.relation){
                    let output = await this.target.read(relation);
                }*/
                return this.relation;
            default:
                throw new Error('Relation method "read" is not implemented for type "' + this.definition.type + '"');
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
        switch(this.definition.type){
            case RelationTypes.one2one:
                let target = this.getTarget(data);
                let isReference = this.isUpdateLinkReference(data, this.definition.linkings.update, target);
                data = this.removeModelKeys(data);
                let keyValueReference = await this.getKeyValueReference(data, target);
                if(isReference){
                    return keyValueReference;
                }else{
                    let updateResult = await target.update(this.removeModelKeys(keyValueReference), data);
                    return keyValueReference;
                }
            default:
                throw new Error('Relation method "update" is not implemented for type "' + this.definition.type + '"'); 
        }
    }

    /**
     * checks the linking type of a remove call
     * @param ressource 
     * @param linking 
     * @param target 
     */
    private isRemoveLinkReference(ressource : any, linking : LinkTypes, target : Model){
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
     * @param ressource 
     */
    public async remove(ressource : any) {
        switch(this.definition.type){
            case RelationTypes.one2one:
                let target = this.getTarget(ressource);
                let isReference = this.isRemoveLinkReference(ressource, this.definition.linkings.remove, target)
                if(isReference){
                    return true;
                    
                }else{
                    let keyValueReference = await this.getKeyValueReference(this.removeModelKeys(ressource), target);
                    return await target.remove(this.removeModelKeys(keyValueReference));
                }
            default:
                throw new Error('Relation method "remove" is not implemented for type "' + this.definition.type + '"');   
        }
    }


}