
/**
 * describes a command data object
 */
export class CommandData {
    constructor(name : string, reference : Function, parameter? : Array<string>){
        this.name = name;
        this.reference = reference;
        if(parameter){
            this.parameter = parameter;
        }
    }

    public execute(data : any){
        let parameterValues = this.parameter.map((current) => data[current]);
        return this.reference(...parameterValues);
    }

    public name : string
    public parameter : Array<string>
    public reference : Function
} 