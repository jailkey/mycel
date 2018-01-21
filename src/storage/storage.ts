import { ModelPropertyData, Model } from '../model/model';
import { StorageQuery } from './storage.query';

export interface ResourceAccessKey {
    [key : string] : string
}

export interface Storage {
    create(data : Array<ModelPropertyData>) : Promise<any>
    read(resourceId : ResourceAccessKey) : Promise<any>
    update(resourceId : ResourceAccessKey, data : Array<ModelPropertyData>) : Promise<boolean>
    remove(resourceId : ResourceAccessKey) : Promise<boolean>
    query(query : StorageQuery) : Promise<Array<any>>
}

