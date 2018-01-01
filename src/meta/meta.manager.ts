import { MetaData, MetaDataTypes } from './meta.data';

export interface MetaInitialiserFunction {
    (target: any, type : MetaData) : any;
}

/**
 * Manages meta data types initialiser functions
 */
class MetaTypeInitialiserClass {
    private initialiser : Array<{
        type : MetaDataTypes,
        initialiser : MetaInitialiserFunction
    }> = [];

    /**
     * adds a new initialiser for a type
     * @param type 
     * @param initialiser 
     */
    public set(type : MetaDataTypes, initialiser : MetaInitialiserFunction) {
        this.initialiser.push({
            type : type,
            initialiser : initialiser
        })
    }

    /**
     * gets a initialiser from a type
     * @param type 
     */
    public get(type : MetaDataTypes) {
        return this.initialiser.find(current =>  current.type === type);
    }

    /**
     * executes a initialiser for a type
     * @param target 
     * @param data 
     */
    public execute(target : any, data : MetaData){
        let initialiser = this.get(data.type);
        if(!initialiser) {
            throw new Error('No initialiser for type "' + data.type + "' found!");
        }

        return initialiser.initialiser(target, data)
    }
}

//a single instance is needed to store the data globally
export const MetaTypeInitialiser = new MetaTypeInitialiserClass();

/**
 * Manages decorators metadata
 */
export class MetaManager {

    /**
     * adds metadata to a class
     * @param target 
     * @param data 
     */
    public static set(target: any, data : MetaData){
        target.__meta = target.__meta || [];
        target.__meta.push(data);
        return this;
    }

    /**
     * gets metadata from an instance
     * @param target 
     */
    public static get(target : any) : Array<MetaData>{
        console.log("get", target);
        return target.__meta || [];
    }

    /**
     * executes all metadata related to an instance
     * @param target 
     */
    public static execute(target : any) {
       if(target.__meta){
           target.__meta.forEach((data) => {
                MetaTypeInitialiser.execute(target, data)
           });
       }
    }
}
