export class ServiceRequest {
    constructor(command : string, data? : any){
        this.command = command;
        if(data){
            this.data = data;
        }
    }
    readonly command : string
    readonly data : any
}