import { OnValidate } from '../validation.on.validate';
import { ValidationMessage, ValidationMessageStates } from '../validation.message';

export class Require implements OnValidate {
    public async onValidate(value : string, target : any, property : string){
        if(value !== undefined && value !== '' && value !== null){
            return new ValidationMessage(ValidationMessageStates.success, null, target, property);
        }

        return new ValidationMessage(ValidationMessageStates.error, 'Require', target, property);
    }
}