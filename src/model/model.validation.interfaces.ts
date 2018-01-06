import { ValidationMessage, ValidationMessageStates } from '../validation/validation.message';

export interface PropertyValidationMessageList {
    (key : string) : {
        isValid : boolean,
        messages : Array<ValidationMessage>
    }
}

export interface ValidationResult {
    isValid : boolean,
    properties : PropertyValidationMessageList | {}
}