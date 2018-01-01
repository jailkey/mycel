import { MetaDataTypes, MetaData } from '../meta/meta.data';
import { ValidationMessage } from './validation.message';

export class ValidationData implements MetaData {
    constructor(target : any, property : string, value : any){
        this.value = value;
        this.target = target;
        this.property = property;
    }
    type : MetaDataTypes = MetaDataTypes.info;
    value : any;
    target : any;
    property : string;
}