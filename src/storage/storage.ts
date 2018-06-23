import { ModelPropertyData } from '../model/model.protoytpe';
import { StorageQuery } from './storage.query';

export interface ResourceAccessKey {
    [key : string] : string
}

export interface Storage {
    create(data : Array<ModelPropertyData>) : Promise<any>
    read(resourceId : ResourceAccessKey | Function) : Promise<any>
    update(resourceId : ResourceAccessKey | Function, data : Array<ModelPropertyData>) : Promise<boolean>
    remove(resourceId : ResourceAccessKey | Function) : Promise<boolean>
    query(query : StorageQuery) : Promise<Array<any>>
}

