export class ServiceResponse {
    constructor(acknowledged : boolean, data? : any){
        this.data = data;
        this.acknowledged = acknowledged
    }

    public readonly acknowledged : boolean = false;
    public readonly data : any = false;
}