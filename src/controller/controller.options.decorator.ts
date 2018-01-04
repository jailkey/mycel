import { Controller } from './controller';
import { Model } from '../model/model';

export interface ControllerData {
    namespace? : string
    controller? : Array<typeof Controller>
    models? : Array<typeof Model>
}

export function ControllerOptions(options : ControllerData){
    return function(target: any) {
        var original = target;

        function construct(constructor, args) {
  
            let newInstance : any = new constructor(...args);

            if(options.namespace){
                newInstance.namespace = options.namespace
            }

            if(options.controller && options.controller.length) {
                options.controller.forEach((contr) => {
                    newInstance.controller.register(new contr())
                });
            }

            if(options.models && options.models.length) {
                options.models.forEach((contr) => {
                    newInstance.models.register(new contr())
                });
            }

            return newInstance;
        }

        var wrapped : any = function (...args) {
            return construct(original, args);
        }

        wrapped.prototype = original.prototype;

        return wrapped;
    }
}