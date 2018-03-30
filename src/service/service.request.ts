import *  as uuid from 'uuid';

export class ServiceRequest {
    constructor(command : string, data? : any, uid : string = uuid()){
        this.command = command;
        if(data){
            this.data = data;
        }
        this.uuid = uid;
    }
    public readonly command : string
    public readonly data : any

    public readonly uuid : string;
}

export function ServiceRequestFactory(data){
    return new ServiceRequest(data.command, data.data, data.uuid);
}