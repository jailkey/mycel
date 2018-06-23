import { Storage, ResourceAccessKey } from './storage';
import { exists, open, readFile, writeFile } from 'fs';
import { StoragePermissions } from './storage.permissions';
import { ModelPropertyData } from '../model/model.protoytpe';
import { QueryActions, QueryConditionTypes, QueryDescription, QueryCondition, StorageQuery } from './storage.query';


export interface FileStoreOptions {
    path : string,
    name : string,
    permissions : StoragePermissions
}

export class FileStorage implements Storage {
    constructor(options : FileStoreOptions){
        this.options = options;
    }

    private options : FileStoreOptions;

    private getFilePermissions(){
        if(this.options.permissions.read && this.options.permissions.write){
            return 'w+';
        }
        return 'r';
    }

    private getFilePath(){
        return this.options.path + '/' + this.options.name + '.json';
    }

    private async fileExists() : Promise<any> {
        return new Promise((resolve) => {
            exists(this.getFilePath(), resolve)
        })
    }

    private openFile() : Promise<boolean>{
        return new Promise((resolve, reject) => {
            open(this.getFilePath(), this.getFilePermissions(), (error) => {
                if(error) { 
                    reject(error) 
                    return;
                }
                resolve(true);
            })
        })
    }

    private readFile() : Promise<Array<any>>{
        return new Promise( async (resolve, reject) => {
            try {
                if(this.options.permissions.read){
                    let exists = await this.fileExists();
                    if(!exists){
                        resolve([])
                    }else{
                        readFile(this.getFilePath(), 'utf8', (err, data : any) => {
                            if(err){
                                reject(err);
                                return;
                            }
                            if(data.trim()){
                                try {
                                    let output = JSON.parse(data);
                                    resolve(output);
                                }catch(e){
                                    resolve([]);
                                }
                            }else{
                                resolve([]);
                            }
                        })
                    }
                }else{
                    reject(new Error('You do not have permissions to read the file "' + this.getFilePath() + '".'));
                }
                
            }catch(e){
                reject(e);
            }
        })
    }

    private writeFile(data : any) : Promise<boolean> {
        return new Promise((resolve, reject) => {
            try {
                if(this.options.permissions.write){
                    writeFile(this.getFilePath(), JSON.stringify(data, null, 2), (err) => {
                        if(err){
                            reject(err);
                            return;
                        }
                        resolve(true);
                    })
                }else{
                    reject(new Error('You do not have permissions to write the file "' + this.getFilePath() + '".'))
                }
            }catch(e){
                reject(e);
            }
        })
    }

    private autoIncrement(fileData : Array<any>, property : string){
        if(!fileData.length){
            return 0;
        }
        let result = fileData.reduce((previous, current) => {
            return (previous[property] > current[property]) ? previous : current;
        });
        let increment = result[property];
        return ++increment;
    }

    private findKey(resource : ResourceAccessKey | Function, data : Array<any>){
        return data.filter((current : any) => {
            let found = true;
            if(typeof resource === 'function'){
                found = resource(current);
            }else{
                for(let key of Object.keys(resource)){
                    if(current[key] !== resource[key]){
                        found = false;
                    }
                }
            }
            
            return found;
        })
    }

    private addData(data, enty){
        let savedData = {};
        for(let property of enty){
            let value = (property.autoIncrement) 
                ? this.autoIncrement(data, property.name)
                : property.value

            savedData[property.name] = value;
        }
        data.push(savedData);
        return savedData;
    }

    /**
     * creates a new entry with the given data
     * @param data 
     */
    public async create(data : Array<ModelPropertyData> | Array<Array<ModelPropertyData>>) {
        try {
            let fileData = await this.readFile();
            let output;
            if(Array.isArray(data[0])){
                output = [];
                for(let entry of data){
                    output.push(this.addData(fileData, entry));
                }
            }else{
                output = this.addData(fileData, data);
            }
            await this.writeFile(fileData);
            return output;
        }catch(e){
            throw e;
        }
    }

    /**
     * reads an entry by the resource RessourceAccessKey
     * @param resourceId 
     */
    public async read(ressource : ResourceAccessKey | Function){
        try {
            let fileData = await this.readFile();
            let foundRead = this.findKey(ressource, fileData);
            return (!foundRead.length)
                ? null
                : (foundRead.length === 1) 
                        ? foundRead[0]
                        : foundRead;
        }catch(e){
            throw e;
        }
    }

    private updateEntry(resource, data){
       
    }

    /**
     * updates an entry by RessourceAccessKey
     * @param resourceId 
     * @param data 
     */
    public async update(resource : ResourceAccessKey | Function, data : Array<ModelPropertyData>){
        try {
            let fileData = await this.readFile();
            for(let i = 0; i < fileData.length; i++){
                let found = true;
                if(typeof resource === 'function'){
                    found = resource(fileData[i]);
                }else{
                    for(let key of Object.keys(resource)){
                        if(fileData[i][key] !== resource[key]){
                            found = false;
                        }
                    }
                }
                
                if(found){
                    for(let y = 0; y < data.length; y++){
                        fileData[i][data[y].name] = data[y].value;
                    }
                    await this.writeFile(fileData);
                    return true;
                }
            }
        }catch(e){
            throw e;
        }
       
    }

    /**
     * removes an entry by a RessourceAccessKey
     * @param resourceId 
     */
    public async remove(resource : ResourceAccessKey | Function){
        try {
            let fileData = await this.readFile();
            let output = fileData.filter((current) => {
                let found = true;
                if(typeof resource === 'function'){
                    found = resource(current);
                }else{
                    for(let key of Object.keys(resource)){
                        if(current[key] !== resource[key]){
                            found = false;
                        }
                    }
                }
                return !found;
            });
            await this.writeFile(output);
            return true;
        }catch(e){
            throw e;
        }
    }

    /**
     * deletes all entries from the storage
     */
    public async reset(){
        try {
            await this.writeFile([]);
            return true;
        }catch(e){
            throw e;
        }
    }

    private createFilter(query : QueryCondition, filter = [], filterIndex = 0){
        if(!filter.length){
            filter[filterIndex] = [];
        }
        if(query.filter && (!query.type || query.type === QueryConditionTypes.and)){
            filter[filterIndex].push({
                filter : query.filter,
                query : query
            });
        }
        if(query.filter && (query.type && query.type === QueryConditionTypes.or)){
            filterIndex++;
            filter[filterIndex] = [];
            filter[filterIndex].push({
                filter : query.filter,
                query : query
            })
        }
        if(query.child){
            return this.createFilter(query.child, filter, filterIndex);
        }

        return filter;
    }

    private createListCondition(listData : Array<any>){
        let output : QueryCondition = {};
        for(let listEntry of listData){
            let condition: QueryCondition = {};
            condition.type = QueryConditionTypes.or;
            condition.filter = (entry) => {
                let result = false;
                for(let prop in listEntry){
                    if(listEntry.hasOwnProperty(prop)){
                        if(entry[prop] === listEntry[prop]){
                            result = true;
                        }else{
                            return false;
                        }
                    }
                }
                return result;
            }
            if(output.child){
                output.child = condition
                output = output.child;
            }else{
                output = condition;
            }
        }
        return output;
    }

    private readFiltered(data : Array<any>, filter : Array<Array<any>>){
        return data.filter((entry) => {
            for(let i = 0; i < filter.length; i++){
                let result = true;
                for(let y = 0; y < filter[i].length; y++){
                    if(!(filter[i][y].filter(entry))){
                        result = false;
                        break;
                    }
                }
                if(result){
                    return result;
                }
            }
            return false;
        })
            
    }

    private updateFiltered(data : Array<any>, filter : Array<Array<any>>){
        let updated = [];
        let createData = [];

        for(let i = 0; i < data.length; i++){
            for(let y = 0; y < filter.length; y++){
                let result = true;
                let updateData, notFound;
                for(let x = 0; x < filter[y].length; x++){
                    if(!(filter[y][x].filter(data[i]))){
                        result = false;
                        notFound = filter[y][x].query.data;
                    }else{
                        if(Array.isArray(filter[y][x].query.data)){
                            updateData = filter[y][x].query.data.map((entry) => {
                                let output = {};
                                output[entry.name] = entry.value;
                                return output;
                            });
                        }else{
                            let output = {};
                            output[filter[y][x].query.data.name] = filter[y][x].query.data.value;
                            updateData = output;
                        }
                    }
                }
                if(result){
                    data[i] = { ...data[i], ...updateData };
                }else{
                    createData.push(notFound);
                }
            }
        }

        return data;
    }


    public async query(storageQuery : StorageQuery){
        let fileData = await this.readFile();
        let query = storageQuery.getQuery();
        let condition, filter, result;
        switch(query.action){
            case QueryActions.read:
                condition = (query.list && query.list.length)
                    ? this.createListCondition(query.list)
                    : query.condition
              
                filter = this.createFilter(condition);
                result = this.readFiltered(fileData, filter);
                return result;
            case QueryActions.update:
                condition = query.condition
                filter = this.createFilter(condition);
                result = this.updateFiltered(fileData, filter);
     
                this.writeFile(result);
                return true;
        }
        return [];
    }

}