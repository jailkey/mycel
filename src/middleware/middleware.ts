import { ServiceRequest } from '../service/service.request';

export interface MiddlewareRequest {
    onRequest(ServiceRequest) : Promise<ServiceRequest>
}