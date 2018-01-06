import { Store } from '../store/store';

export interface ModelData {
    storage : Store
}

export function ModelOptions(options : ModelData){
    return function(target: any) {
        var original = target;

        function construct(constructor, args) {
  
            let newInstance : any = new constructor(...args);
            return newInstance;
        }

        var wrapped : any = function (...args) {
            return construct(original, args);
        }

        wrapped.prototype = original.prototype;

        return wrapped;
    }
}