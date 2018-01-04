import { OnValidate } from '../validation.on.validate';
import { ValidationMessage, ValidationMessageStates } from '../validation.message';

/**
 * validation factory
 * @param len 
 */
export function MinLength(len : number){
    return class MinLength implements OnValidate {
        public async onValidate(value : string, target : any, property : string){
            if(value !== undefined && typeof value === 'string' && value.length >= len){
                return new ValidationMessage(ValidationMessageStates.success, null, property, target);
            }
            return new ValidationMessage(ValidationMessageStates.error, 'MinLength', property, target);
        }
    }
}
