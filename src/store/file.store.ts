import { Store } from './store';
import { exists, open, readFile, writeFile } from 'fs';
import { StorePermissions } from './store.permissions';

export interface FileStoreOptions {
    storagePath : string,
    name : string,
    permissions : StorePermissions
}

export class FileStore implements Store {
    constructor(options : FileStoreOptions){

    }

    private options : FileStoreOptions;

    private getFilePermissions(){
        if(this.options.permissions.read && this.options.permissions.write){
            return 'w+';
        }
        return 'r';
    }

    private getFilePath(){
        return this.options.storagePath + '/' + this.options.name + '.json';
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
                        readFile(this.getFilePath(), (err, data : any) => {
                            if(err){
                                reject(err);
                                return;
                            }
                            resolve(JSON.parse(data));
                        })
                    }
                }
                reject(new Error('You do not have permissions to read the file "' + this.options.name + '".'));
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
                    reject(new Error('You do not have permissions to write the file "' + this.options.name + '".'))
                }
            }catch(e){
                reject(e);
            }
        })
    }

    private getUniqueId(){
        
    }

    public async create(data : any) {
        
    }

    public async read(resourceId : string){

    }

    public async update(resourceId : string, data : any){
        return true;
    }

    public async remove(resourceId : string){
        return true;
    }

    public async query(query : any){

    }
}