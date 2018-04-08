import { ServiceRequest } from './service.request';
import { ServiceResponse } from './service.response';
import { EventEmitter } from 'events';

export interface ServiceConnectorOptions {
    protocol? : string;
    hostname? : string;
    port? : number;
    username? : string;
    password? : string;
    locale? : string;
    frameMax? : number;
    heartbeat? : number;
    vhost? : string;
    timeout? : number;
}

export interface QuestionHandler {
    id : number,
    callback : Function
}

export interface ServiceConnector {
    setQueue(queue : string)
    publish(message : ServiceRequest) : Promise<ServiceResponse>
    subscribe(callback : Function)
    connect() : Promise<boolean>
    disconnect() : Promise<boolean>
    on(event : string, callback : Function)
    isConnected : boolean
}