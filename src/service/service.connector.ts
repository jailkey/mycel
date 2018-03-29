import { ServiceRequest } from './service.request';
import { ServiceResponse } from './service.response';

export interface ServiceConnectorOptions {
    protocol?: string;
    hostname?: string;
    port?: number;
    username?: string;
    password?: string;
    locale?: string;
    frameMax?: number;
    heartbeat?: number;
    vhost?: string;
}

export interface QuestionHandler {
    id : number,
    callback : Function
}

export interface ServiceConnector {
    publish(message : ServiceRequest) : Promise<ServiceResponse>
    subscribe(callback : QuestionHandler)
    connect() : Promise<boolean>
    disconnect() : Promise<boolean>
}