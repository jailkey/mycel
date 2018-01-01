import { OnValidate } from './validation.on.validate';
import { ValidationMessage } from './validation.message';

export class Validator {

    public static async validate (value: any, validation : any, target? : any, propertyName? : string) : Promise<ValidationMessage> {
        let validationInstance = new validation();
        return await validationInstance.onValidate(value, target, propertyName);
    }
}