import { Controller } from '../controller/controller';
import { Service } from './service';

export interface MicroServiceOptions {
    controller : Array<typeof Controller>
}

export function MicroService(options : MicroServiceOptions){
    return function(target: any) {
        var original = target;

        function construct(constructor, args) {
  
            let newInstance : any= new constructor(...args);
            options.controller.forEach((contr) => {
                newInstance.controller.register(new contr())
            });
            return newInstance;
        }

        var f : any = function (...args) {
            return construct(original, args);
        }

        f.prototype = original.prototype;

        return f;
    }
}