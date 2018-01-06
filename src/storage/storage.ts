import { ModelPropertyData, Model } from '../model/model';

export interface RessourceAccessKey {
    [key : string] : string
}

export interface Storage {
    create(data : Array<ModelPropertyData>) : Promise<boolean>
    read(resourceId : RessourceAccessKey) : Promise<any>
    update(resourceId : RessourceAccessKey, data : Array<ModelPropertyData>) : Promise<boolean>
    remove(resourceId : RessourceAccessKey) : Promise<boolean>
    query(query : string) : Promise<Array<any>>
}

