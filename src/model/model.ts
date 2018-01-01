import { PresentationTree } from './presentation.tree';
import { MetaManager } from '../meta/meta.manager';
import { MetaDataTypes } from '../meta/meta.data';
import { ValidationMessage, ValidationMessageStates } from '../validation/validation.message';
import { Validator } from '../validation/validator';

export class ModelPropertyData {
    constructor(name : string, value? : any, validations? : any){
        this.name = name;
        this.value = value;
        this.validations = validations || [];
    }
    public name : string;
    public value : any;
    public validations : Array<any>;
    public presentation : any;
}

export interface UpdateData {
    (key : string) : any
}

export interface PropertyValidationMessageList {
    (key : string) : {
        isValid : boolean,
        messages : Array<ValidationMessage>
    }
}

export class Model {

    constructor() {
        MetaManager.execute(this);
    }
    
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

    /**
     * validates the complete model
     * @param data if data is defined this values will used for validation
     */
    public async validate(data? : any) : Promise<PropertyValidationMessageList | {}> {
        let propertieNames = Reflect.ownKeys(this);
        let propertyListMessageList : PropertyValidationMessageList | {} = {};
        for(let propertyName of propertieNames){
            propertyListMessageList[propertyName] = {
                isValid : false,
                messages : []
            }
            let value = (data && data[propertyName]) ? data[propertyName] : null;
            let validationMessage = await this.validateProperty(propertyName as string, value);
            propertyListMessageList[propertyName].messages = propertyListMessageList[propertyName].messages.concat(validationMessage)
            propertyListMessageList[propertyName].isValid = !this.hasErrors(propertyListMessageList[propertyName].messages)
        }
        return propertyListMessageList;
    }

    public async query() : Promise<any> {

    }

    public async create() : Promise<any> {

    }

    public async update() : Promise<any> {
        
    }

    public async get() : Promise<any> {

    }

    public async delete() : Promise<any> {

    }

    private getMetaData(propertyName : string, type : MetaDataTypes){
        return MetaManager.get(this).filter((current) => {
            return current.property === propertyName
                    && current.type === type
        });
    }

    private getProperty(propertyName : string){
        if(!propertyName.startsWith('_') && typeof propertyName !== 'function'){
            return new ModelPropertyData(
                propertyName,
                this[propertyName],
                this.getMetaData(propertyName, MetaDataTypes.validation)
            )
        }
        return null;
    }

    public async properties() : Promise<Array<ModelPropertyData>> {
        let properties = [];
        let propertieNames = Reflect.ownKeys(this);
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

export function Index() : any {

}