import { MetaDataTypes, MetaData } from '../meta/meta.data';

export enum ModelPropertyInfoDataTypes {
    validation = 'validation',
    presentation = 'presentation',
    index = 'index'
}

export class ModelPropertyInfoData implements MetaData {
    constructor(target : any, property : string, infoType : ModelPropertyInfoDataTypes,  value : any){
        this.target = target;
        this.property = property;
        this.infoType = infoType;
        this.value = value;
    }
    public infoType : ModelPropertyInfoDataTypes;
    public target : any;
    public property : string;
    public type : MetaDataTypes = MetaDataTypes.info;
    public value : any;

}