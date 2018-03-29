import { Controller } from '../controller/controller';
import { ServiceConnector } from './service.connector';

export interface MicroServiceOptions {
    controller? : Array<typeof Controller>
    connector? : ServiceConnector
}

export function MicroService(options : MicroServiceOptions){
    console.log("options", options)
    return function(target: any) {
        var original = target;

        function construct(constructor, args) {
  
            let newInstance : any = new constructor(...args);
            
            //add controllers to the service if available
            if(options.controller && options.controller.length){
                options.controller.forEach((contr) => {
                    newInstance.controller.register(new contr())
                });
            }

            //if there is a connector put it to the service 
            if(options.connector){
                newInstance.connector = options.connector;
            }
            
            return newInstance;
        }

        var f : any = function (...args) {
            return construct(original, args);
        }

        f.prototype = original.prototype;

        return f;
    }
}