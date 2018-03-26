import { Model, ModelPropertyData } from './model';
export class ModelHelper {

    public static async convertToModelPropertyData(data : any, model : Model){
        let properties = await model.properties();
        let relations = await model.getRelations();
      
        for(let i = 0; i < properties.length; i++){
            if(data.hasOwnProperty(properties[i].name)){
                properties[i].value = data[properties[i].name];
            }
        }
        return properties;
    }

    public static convertToPlainData(data: Array<ModelPropertyData>){
        let output = {};
        for(let entry of data){
            output[entry.name] = entry.value;
        }
        return output;
    }

    public static removeModelKey(value : string){
        return (~value.indexOf('.')) ? value.split('.')[1] : value;
    }

    /**
     * removes the model keys from data
     * @param data 
     */
    public static removeModelKeys(data : any){
        let output = {};
        for(let prop in data){
            if(data.hasOwnProperty(prop)){
                let key = ModelHelper.removeModelKey(prop);
                output[key] = data[prop];
            }
        }
        return output;
    }

    public static getModelKey(data : any){
        for(let prop in data){
            if(~prop.indexOf('.')){
                return prop.split('.')[0];
            }
        }
        return null;
    }
}