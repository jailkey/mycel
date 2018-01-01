import { ValidationMessage } from './validation.message';

export interface OnValidate {
    onValidate(value : any, target : any, propertyName ? : any) : Promise<ValidationMessage>
}