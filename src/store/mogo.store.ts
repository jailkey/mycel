import { StoreInterface } from './store';

export interface MongoStoreConfig {
    name : string;
}

export class MongoStore implements StoreInterface {
    
    constructor(config : MongoStoreConfig){

    }

    private init(){

    }

    public async create(id : string){

    }

    public async read(id : string){

    }

    public async update(id : string, value : any){
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