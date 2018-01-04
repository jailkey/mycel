export enum ValidationMessageStates {
    error = 'error',
    success = 'success'
}

/**
 * validation message class
 */
export class ValidationMessage {
    constructor(state : ValidationMessageStates, text?: string,  model? : string, property? : string){
        this.state = state;
        this.property = property;
        this.model = model;
        this.text = text;
    }
    public model : string
    public property : string
    public state : string
    public text : string
}