import { PropertyValidationMessageList, ValidationResult } from './model.validation.interfaces';

export class ModelValidationError extends Error {
    constructor(message : string, name : string, validation : ValidationResult) {
        super(message);
        this.message = message;
        this.name = name;
        this.validation = validation;
    }

    public message : string;
    public name : string;
    public validation : ValidationResult;
}