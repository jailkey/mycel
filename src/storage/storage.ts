import { ModelPropertyData, Model } from '../model/model';

export interface ResourceAccessKey {
    [key : string] : string
}

export interface Storage {
    create(data : Array<ModelPropertyData>) : Promise<any>
    read(resourceId : ResourceAccessKey) : Promise<any>
    update(resourceId : ResourceAccessKey, data : Array<ModelPropertyData>) : Promise<boolean>
    remove(resourceId : ResourceAccessKey) : Promise<boolean>
    query(query : string) : Promise<Array<any>>
}

