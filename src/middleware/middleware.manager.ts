import { MiddlewareRequest } from '../middleware/middleware';
import { ServiceRequest } from '../service/service.request';

/**
 * manages all middlewares in a service
 */
export class MiddlwareManager {

    private middleware : Array<any> = [];
    
    /**
     * registers a new middleware
     * @param middleware the middleware class
     */
    public register<T extends MiddlewareRequest>(middleware : new() => T) : MiddlwareManager{
        this.middleware.push({
            name : middleware.name,
            middleware : new middleware()
        });
        return this;
    }

    /**
     * unregisters a middleware
     * @param middleware the middleware class
     */
    public unregister<T extends MiddlewareRequest>(middleware : new() => T) : MiddlwareManager {
        this.middleware = this.middleware.filter((current) => {
            return (current.name === middleware.name) ? false : true;
        })
        return this;
    }

    /**
     * gets a middlware instance by the middleware class, its not a factory the middleware will instantiated in the register method
     * @param middleware
     * @returns if found the middleware instance will be returned 
     * @throws if the middleware is not registerd a Error is thrown
     */
    public get<T>(middleware : new() => T) : new() => T{
        let selected = this.middleware.find(current => current.name === middleware.name);
        if(selected){
            return selected.middleware;
        }
        throw new Error('Middleware "' + middleware.name + '" is not registerd!');

    }

    /**
     * applies all registerd middlewares to a request
     * @async
     * @param request 
     */
    public async applyRequest(request : ServiceRequest){
        for(let middlewareContainer of this.middleware){
            request = await middlewareContainer.middleware.onRequest(request);
        }
        return request;
    }

}