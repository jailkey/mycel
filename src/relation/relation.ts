import { Model } from '../model/model';
import { MetaManager, MetaTypeInitialiser } from '../meta/meta.manager';
import { MetaData, MetaDataTypes } from '../meta/meta.data';

export enum RelationTypes {
    One2One = 'One2One',
    One2N = 'One2N',
    M2N = 'M2N'
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
    relationKeyType : RelationKeyTypes;
    relationKeys? : Array<string>;
    linkings? : RelationLinks;  
}


export function Relation(target : typeof Model, definition : RelationDefinition) : any{
    return function (source, property) {
        let relation = new RelationClass(source, target, definition);

        let metaData : MetaData = {
            type : MetaDataTypes.relation,
            target : target,
            property : property,
            value : relation
        }
      
        MetaManager.set(target, metaData);
      
        return relation;
    }
}

export class RelationClass {
    constructor(model : typeof Model, target : typeof Model, definition : RelationDefinition){

        this.model = model;
        this.target = new target();
    }

    public model : typeof Model;
    public target : Model;
    public relationKeys : any;
    public type : RelationTypes;
    private relations : Array<any> = [];

    private isRelationData(data : any){
        
    }

    public async read(){

    }

    public async create(){

    }

    public async update(){

    }

    public async remove() {

    }

    public async getRelations(){
        switch(this.type){
            case RelationTypes.M2N:
                let output = [];
                for(let relation of this.relations){
                    let output = await this.target.read(relation);
                }
                return this.relations;
            case RelationTypes.One2N:
                break;
            case RelationTypes.One2One:
                return await this.target.read(this.relations);
        }
    }

    public setRelation(relation : any){
        switch(this.type){
            case RelationTypes.M2N:
                this.relations.push(relation);
                break;
            case RelationTypes.One2N:
                this.relations = relation;
                break;
            case RelationTypes.One2One:
                this.relations = relation;
                break;
        }
        this.relations.push(relation);
    }
}