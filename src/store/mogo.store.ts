import { StoreInterface } from './store';

export interface MongoStoreConfig {
    name : string;
}

export class MongoStore implements StoreInterface {
    
    constructor(config : MongoStoreConfig){

    }

    public async open(id : string){

    }

    public async create(id : string){

    }

    public async save(id : string, value : any){
        return true;
    }

    public async remove(id : string){
        return true;
    }

    public async query(query : MongoQuery){
        return [];
    }
}

export class MongoQuery {
    
}