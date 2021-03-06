import { PresentationTree } from './presentation.tree';
import { MetaManager } from '../meta/meta.manager';
import { MetaDataTypes, MetaData } from '../meta/meta.data';
import { ValidationMessage, ValidationMessageStates } from '../validation/validation.message';
import { Validator } from '../validation/validator';
import { Storage } from '../storage/storage';
import { PropertyValidationMessageList, ValidationResult } from './model.validation.interfaces';
import { ModelValidationError } from './model.validation.error';
import { ResourceAccessKey } from '../storage/storage';
import { CommandManager } from '../command/command.manager';
import { ModelRelation } from '../relation/relation';
import { StorageQuery, QueryActions } from '../storage/storage.query';
import { RelationTypes } from '../relation/relation.types';
import { ModelHelper } from './model.helper';
import { ENGINE_METHOD_DIGESTS } from 'constants';

export interface ModelPropertyDataOptions {
    validations? : Array<any>
    presentation?: any
    index? : boolean
    autoIncrement? : boolean
    key? : boolean,
    relation? : ModelRelation
}

export class ModelPropertyData {
    constructor(name : string, value? : any, options? : ModelPropertyDataOptions){
        this.name = name;
        this.value = value;
        if(options) {
            this.validations = options.validations || [];
            this.index = options.index || false;
            this.autoIncrement = options.autoIncrement || false;
            this.key = options.key || false;
            this.relation = options.relation || null;
        }
    }
    public name : string;
    public value : any;
    public validations : Array<any> = [];
    public presentation : any;
    public index : boolean = false;
    public autoIncrement : boolean = false;
    public key : boolean = false;
    public relation : ModelRelation = null;
}

export interface UpdateData {
    (key : string) : any
}

export interface ResourceData {

}


export class ModelPrototype {

    constructor() {
        MetaManager.execute(this);
    }

    public __storage : Storage;

    public __commands : CommandManager =  new CommandManager();
    
    public presentations() : Promise<PresentationTree> { 
        return;
    }

    public validations() : any {
        return;
    }

    public getName(){
        return this.constructor.name;
    }

    /**
     * validate a property by its name
     * @param propertyName 
     * @param value an optional validation value, used to validate incoming update values
     */
    private async validateProperty(propertyName : string, value? : any) : Promise<Array<ValidationMessage>> {
        let data = this.getProperty(propertyName);
        if(!data){
            return [];
        }
        let validationMessages = [];
        for(let validation of data.validations){
            value = (value !== undefined) ? value : data.value;
            validationMessages.push(await Validator.validate(value, validation.value,  this.getName(), propertyName))
        }
        if(validationMessages.length){
            return validationMessages;
        }
        return [new ValidationMessage(ValidationMessageStates.success)];
    }

    private hasErrors(messages : Array<ValidationMessage>){
        for(let entry of messages){
            if(entry.state === ValidationMessageStates.error){
                return true;
            }
        }
        return false;
    }

    private getPropertyNames(){
        let propertieNames = Reflect.ownKeys(this);
        return propertieNames.filter((current : string) => {
            return !current.startsWith('_')
        })
    }

    public async getKeys() {
        let properties = await this.properties();
        let keys = properties
            .filter((current) => current.key)
            .map((current) => current.name);

        if(!keys.length){
            throw new Error('No Keys for model "' + this.constructor.name + "' specified!")
        }
        return keys;
    }

    public async getRelations() {
        let properties = await this.properties();
        let relations = properties
            .filter((current) => current.relation)
            .map((current) => current.name);
      
        return relations;
    }

    /**
     * validates the complete model
     * @param data if data is defined this values will used for validation
     */
    public async validate(data? : any) : Promise<ValidationResult> {
        let propertieNames = this.getPropertyNames()
        let propertyListMessageList : PropertyValidationMessageList | {} = {};
        let isValid = true;
        if(!propertieNames.length){
            throw new Error('The model "' + this.constructor.name + '" has no defined properties. Maybe you forgot to define a default value')
        }
        for(let propertyName of propertieNames){
            propertyListMessageList[propertyName] = {
                isValid : false,
                messages : []
            }
            let value = (data && data[propertyName]) ? data[propertyName] : null;
            let validationMessage = await this.validateProperty(propertyName as string, value);
            propertyListMessageList[propertyName].messages = propertyListMessageList[propertyName].messages.concat(validationMessage)
            propertyListMessageList[propertyName].isValid = !this.hasErrors(propertyListMessageList[propertyName].messages)
            if(!propertyListMessageList[propertyName].isValid){
                isValid = false;
            }
        }
        return {
            isValid : isValid,
            properties : propertyListMessageList
        }
    }

    private async convertToResourceAccessKey(data : any, withModelKey : boolean = false) : Promise<ResourceAccessKey> {
        try {
            let output : ResourceAccessKey = {};
            let keys = await this.getKeys();
            if(!withModelKey){
                data = ModelHelper.removeModelKeys(data);
            }
            for(let key of keys){
                if(!data.hasOwnProperty(key)){
                    throw new Error('Can not convert data to RessourceAccessKey, because the data has not property "' + key + '"');
                }
                output[key] = data[key];
            }

            return output;
        }catch(e) {
            throw e;
        }
    }

     /**
     * filters metadata by propertyName and metadata type 
     * @param propertyName 
     * @param type 
     * @returns returns an array of metadata
     */
    private getMetaData(propertyName : string, type : MetaDataTypes) : Array<MetaData> {
        return MetaManager.get(this).filter((current) => {
            return current.property === propertyName
                    && current.type === type
        });
    }

    private getFirstMetaData(propertyName : string, type : MetaDataTypes) : MetaData | null {
        let metaData = this.getMetaData(propertyName, type);
        if(metaData.length){
            return metaData[0];
        }
        return null;
    }

    /**
     * gets a property, with metadata by its propertyName
     * @param propertyName 
     */
    private getProperty(propertyName : string) : ModelPropertyData | null{
        if(!propertyName.startsWith('_') && typeof propertyName !== 'function'){
            let autoIncrement =  this.getFirstMetaData(propertyName, MetaDataTypes.autoIncrement);
            let index = this.getFirstMetaData(propertyName, MetaDataTypes.index);
            let key = this.getFirstMetaData(propertyName, MetaDataTypes.key);
            let relation = this.getFirstMetaData(propertyName, MetaDataTypes.relation);
            return new ModelPropertyData(
                propertyName,
                this[propertyName],
                { 
                    validations : this.getMetaData(propertyName, MetaDataTypes.validation),
                    autoIncrement : (autoIncrement) ? autoIncrement.value : false,
                    index : (index) ? index.value : false,
                    key : (key) ? key.value : false,
                    relation : (relation) ? relation.value : null
                 }
            )
        }
        return null;
    }

    private getQueryFilterFromData(data : Array<any>){
        return (entry) => {
            for(let i = 0; i < data.length; i++){
                let result = false;
                for(let prop in data[i]){
                    if(data[i].hasOwnProperty(prop)){
                        result = (entry[prop] === data[i][prop]);
                    }
                }
                if(result){
                    return true;
                }
            }
            return false;
        }
    }

    private mergeResult(result : Array<any>, data : Array<any>, property : string){
        for(let i = 0; i < result.length; i++){
            result[i][property] = data[i];
        }
        return result;
    }

    /**
     * creates a new model entry
     * @param data and key / value object with the data
     * @throws throws an validation error if the data is not valid
     */
    public async create(data : any) : Promise<string | number | Array<string | number>> {
        try {
            if(Array.isArray(data)){
                let output = [];
                for(let entry of data){
                    output.push(await this.create(entry));
                }
                return output;
            }
            let validation = await this.validate(data);
            if(!validation.isValid) {
                throw new ModelValidationError(
                    'Model "' + this.constructor.name + '" is not valid!',
                    this.constructor.name,
                    validation
                )
            }
            let propertyData = await ModelHelper.convertToModelPropertyData(data, this);
            //create relations
            for(let i = 0; i < propertyData.length; i++){
                if(propertyData[i].relation){
                    if(data[propertyData[i].name] !== undefined){
                        propertyData[i].value = await propertyData[i].relation.create(data[propertyData[i].name]);
                    }
                }
            }
            let result = await this.__storage.create(propertyData);
            return result;
        }catch(e){
            throw e;
        }
    }

    private isEmpty(value : any){
        if(Array.isArray(value)){
            if(!value.length){
                return true;
            }
        }
    }

    private async readRelations(result : any, withModelKeys : boolean = false){
        let propertyData = await ModelHelper.convertToModelPropertyData(result, this);
        //read relations
        for(let i = 0; i < propertyData.length; i++){
            if(propertyData[i].relation &&  result[propertyData[i].name] !== null){
                result[propertyData[i].name] = await propertyData[i].relation.read(result[propertyData[i].name], withModelKeys);
            }
        }
        return result;
    }

    /**
     * reads an entry by the given resource 
     * @param resource
     */
    public async read(resource : ResourceData | Function, withModelKeys : boolean = false) : Promise<any> {
        try {
            if(typeof resource !== 'function' && !Object.keys(resource).length){
                return null;
            }

            let accessKey = (typeof resource === 'function')
                    ? resource
                    : await this.convertToResourceAccessKey(resource)
                    
            let result = await this.__storage.read(accessKey);
            if(!result){
                return null;
            }
            
            if(Array.isArray(result)){
                for(let i = 0; i < result.length; i++){
                    result[i] = await this.readRelations(result[i], withModelKeys);
                }
            }else{
                result = await this.readRelations(result, withModelKeys);
            }

            return result;
        }catch(e){
            throw e;
        }
    }

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

    private getModelKey(data : any){
        for(let prop in data){
            if(~prop.indexOf('.')){
                return prop.split('.')[0];
            }
        }
        return null;
    }

    private getModelKeys(data : any){
        if(Array.isArray(data)){
            return data.map((current) => {
                return this.getModelKey(current);
            })
        }else{
            return this.getModelKey(data);
        }
    }

    private getPropertyName(prop : string, relation : string){
        return (relation) ? relation + '.' + prop : prop;
    }

    private updateData(target : any, newData : any){
        let modelKey = this.getModelKey(newData);
        //newData = this.removeModelKeys(newData);
        for(let prop in newData){
            if(newData.hasOwnProperty(prop)){
                if(Array.isArray(newData[prop])){
                    /*
                    console.log("-------->", prop, newData,  target[prop])
                    throw new Error("Array is not implemented");
                    */
                    let output = [];
                    for(let i = 0; i < newData[prop].length; i++){
                        target[prop][i] = this.updateData(target[prop][i], newData[prop][i]);
                        /*
                        for(let y = 0; y < target[prop].length; y++){
                         
                        }*/
                        //output.push(this.updateData(target[prop][i], )
                    }
                    //target[prop] = newData[prop];
                }else if(Array.isArray(target)){
                    for(let i = 0; i < target.length; i++){
                        if(typeof newData[prop] === 'object'){
                            target[i][prop] = this.updateData(target[i][prop], newData[prop]);
                        }else{
                            target[i][prop] = newData[prop];
                        }
                    }
                }else if(typeof newData[prop] === 'object'){
                    target[prop] = this.updateData(target[prop], newData[prop]);
                }else{
                    target[prop] = newData[prop];
                }
            }
        }
        return target;
    }

    private async updateSingleRelation(currentData : any){
        let propertyData = await ModelHelper.convertToModelPropertyData(currentData, this);
        for(let i = 0; i < propertyData.length; i++){
            if(propertyData[i].relation){
                propertyData[i].value = await propertyData[i].relation.update(currentData[propertyData[i].name]);
            }
        }

        return propertyData;
    }

    private async updateSingleEntry(currentData : any, data : any){
        currentData = this.updateData(currentData, data);
        let validation = await this.validate(currentData);
        
        if(!validation.isValid) {
            throw new ModelValidationError(
                'Model "' + this.constructor.name + '" is not valid!',
                this.constructor.name,
                validation
            )
        }

        let propertyData;
        if(Array.isArray(currentData)){
            propertyData = [];
            for(let entry of currentData){
                propertyData.push(await this.updateSingleRelation(entry));
            }
        }else{
            propertyData = await this.updateSingleRelation(currentData);
        }
        /*
        let propertyData = await ModelHelper.convertToModelPropertyData(currentData, this);
        for(let i = 0; i < propertyData.length; i++){
            if(propertyData[i].relation){
                propertyData[i].value = await propertyData[i].relation.update(currentData[propertyData[i].name]);
            }
        }*/

        return propertyData
    }

    /**
     * updates an existing entry
     * @param resource
     * @param data 
     * @throws throws an ModelValidationError if the data is not valid
     */
    public async update(resource : ResourceData | Function, data : any) : Promise<boolean> {
        try {
       
            let currentData = await this.read(resource, true);
            if(!currentData){
                return false;
            }

            let updatData;

            if(Array.isArray(currentData)){
                updatData =  [];
                for(let entry of currentData){
                    updatData.push(await this.updateSingleEntry(entry, data));
                }
            }else{
                updatData = await this.updateSingleEntry(currentData, data);
            }

            let accessKey = (typeof resource === 'function')
                ? resource
                : await this.convertToResourceAccessKey(resource);
        

            
            return this.__storage.update(accessKey, updatData);
        }catch(e){
            throw e;
        }
    }

    private async removeRelations(result : any){
        let propertyData = await ModelHelper.convertToModelPropertyData(result, this);
        //delete relations
        for(let i = 0; i < propertyData.length; i++){
            if(propertyData[i].relation){
                propertyData[i].value = await propertyData[i].relation.remove(result[propertyData[i].name]);
            }
        }
    }

    /**
     * removes a resource
     * @param resource 
     */
    public async remove(resource : ResourceData | Function) : Promise<any> {
        try {
            let accessKey = (typeof resource === 'function')
                    ? resource
                    : await this.convertToResourceAccessKey(resource);
            
            let result = await this.__storage.read(accessKey);
            if(Array.isArray(result)){
                for(let entry of result){
                    if(entry){
                        await this.removeRelations(entry);
                    }
                }
            }else{
                if(result){
                    await this.removeRelations(result);
                }
            }
            return this.__storage.remove(accessKey);
        }catch(e){
            throw e;
        }
    }

    /**
     * a list of alle model properties with its meta data
     */
    public async properties() : Promise<Array<ModelPropertyData>> {
        let properties = [];
        let propertieNames = this.getPropertyNames()
        for(let prop of propertieNames){
            prop = prop as string;
            let data = this.getProperty(prop);
            if(data) {
                properties.push(data);
            }
        }
        return properties;
    }
}

export function ModelOptions(options : any){
    return options;
}

export function ModelFactory(model : any){
    return new model;
}

