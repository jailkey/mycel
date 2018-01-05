import { Store, RessourceAccessKey } from './store';
import { exists, open, readFile, writeFile } from 'fs';
import { StorePermissions } from './store.permissions';
import { ModelPropertyData, Model } from '../model/model';


export interface FileStoreOptions {
    path : string,
    name : string,
    permissions : StorePermissions
}


export class FileStore implements Store {
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
                            if(data){
                                resolve(JSON.parse(data));
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
                    writeFile(this.getFilePath(), JSON.stringify(data), (err) => {
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
        return result[property]++;
    }

    public async create(data : Array<ModelPropertyData>) {
        try {
            let savedData = {};
            let fileData = await this.readFile();
            for(let property of data){
                savedData[property.name] = (property.autoIncrement) 
                    ? this.autoIncrement(fileData, property.name)
                    : property.value
            }
            fileData.push(savedData);
            await this.writeFile(fileData);
            return true;
        }catch(e){
            throw e;
        }
    }

    private findKey(resourceId : RessourceAccessKey, data : Array<any>){
        return data.find((current : any) => {
            let found = true;
            for(let key of Object.keys(resourceId)){
                if(current[key] !== resourceId[key]){
                    found = false;
                }
            }
            return found;
        })
    }

    public async read(resourceId : RessourceAccessKey){
        try {
            let fileData = await this.readFile();
            return this.findKey(resourceId, fileData);
        }catch(e){
            throw e;
        }
    }

    public async update(resourceId : RessourceAccessKey, data : any){
        try {
            let fileData = await this.readFile();
            for(let i = 0; i < fileData.length; i++){
                let found = true;
                for(let key of Object.keys(resourceId)){
                    if(fileData[i][key] !== resourceId[key]){
                        found = false;
                    }
                }
                if(found){
                    for(let prop in data){
                        if(data.hasOwnProperty(prop)){
                            fileData[i][prop] = data[prop];
                        }
                    }
                    await this.writeFile(fileData);
                    return true;
                }
            }
        }catch(e){
            throw e;
        }
       
    }

    public async remove(resourceId : RessourceAccessKey){
        try {
            let fileData = await this.readFile();
            for(let i = 0; i < fileData.length; i++){
                let found = true;
                for(let key of Object.keys(resourceId)){
                    if(fileData[i][key] !== resourceId[key]){
                        found = false;
                    }
                }
                if(found){
                    fileData.splice(i, 1);
                    await this.writeFile(fileData);
                    return true;
                }
            }
        }catch(e){
            throw e;
        }
    }

    public async reset(){
        try {
            await this.writeFile([]);
            return true;
        }catch(e){
            throw e;
        }
    }

    public async query(query : any){
        return [];
    }
}