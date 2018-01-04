import { Controller } from '../controller/controller';

export interface MicroServiceOptions {
    controller : Array<typeof Controller>
}

export function MicroService(options : MicroServiceOptions){
    return function(target: any) {
        var original = target;

        function construct(constructor, args) {
  
            let newInstance : any = new constructor(...args);
            
            if(options.controller && options.controller.length){
                options.controller.forEach((contr) => {
                    newInstance.controller.register(new contr())
                });
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