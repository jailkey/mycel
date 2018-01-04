export class StorePermissions {
    constructor(read : boolean, write : boolean){
        this.read = read;
        this.write = write;
    }

    public read : boolean

    public write : boolean
}