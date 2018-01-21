import { Storage, ResourceAccessKey } from './storage';
import { exists, open, readFile, writeFile } from 'fs';
import { StoragePermissions } from './storage.permissions';
import { ModelPropertyData, Model } from '../model/model';


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

    private findKey(resourceId : ResourceAccessKey, data : Array<any>){
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


    /**
     * creates a new entry with the given data
     * @param data 
     */
    public async create(data : Array<ModelPropertyData>) {
        try {
            let savedData = {};
            let fileData = await this.readFile();
            for(let property of data){
                let value = (property.autoIncrement) 
                    ? this.autoIncrement(fileData, property.name)
                    : property.value

                savedData[property.name] = value;
            }
            fileData.push(savedData);
            await this.writeFile(fileData);
            return savedData;
        }catch(e){
            throw e;
        }
    }

    /**
     * reads an entry by the resource RessourceAccessKey
     * @param resourceId 
     */
    public async read(resourceId : ResourceAccessKey){
        try {
            let fileData = await this.readFile();
            return this.findKey(resourceId, fileData);
        }catch(e){
            throw e;
        }
    }

    /**
     * updates an entry by RessourceAccessKey
     * @param resourceId 
     * @param data 
     */
    public async update(resourceId : ResourceAccessKey, data : Array<ModelPropertyData>){
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
    public async remove(resourceId : ResourceAccessKey){
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

    public async query(query : any){
        return [];
    }

}