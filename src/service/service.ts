export interface ServiceOptions {
    children? : Array<any>
    namespace : string;
}

export const CHILDREN_PROPERTY_NAME = '__children';
export const NAMESPACE_PROPERTY_NAME = '__namespace';


export function Service(options : ServiceOptions){
    return function(target: any) {
        options.children = options.children || [];
        let children : Array<any> = options.children.map((current) => {
            if(!current.prototype[NAMESPACE_PROPERTY_NAME]){
                throw new Error('Service children must have a namespace! [@Service]');
            }
            return new current()
        });
        
        Object.defineProperty(target.prototype, CHILDREN_PROPERTY_NAME, {
            enumerable: true,
            configurable: true,
            writable: true,
            value: children
        })

        Object.defineProperty(target.prototype, NAMESPACE_PROPERTY_NAME, {
            enumerable: true,
            configurable: true,
            writable: true,
            value: options.namespace
        })
 
        return target;
    }
}
/*
export function ControllerOptions(options : ControllerData){
    return function(target: any) {
        var original = target;

        function construct(constructor, args) {
  
            let newInstance : any = new constructor(...args);
            newInstance.__name = target.name;

            if(options.namespace){
                newInstance.namespace = options.namespace
            }

            if(options.controller && options.controller.length) {
                options.controller.forEach((contr) => {
                    newInstance.controller.register(new contr())
                });
            }

            if(options.models && options.models.length) {
                options.models.forEach((model) => {
                    newInstance.models.register(model)
                });
            }

            return newInstance;
        }

        var wrapped : any = function (...args) {
            return construct(original, args);
        }

        wrapped.prototype = original.prototype;

        wrapped.__name = target.name;

        return wrapped;
    }
}*/