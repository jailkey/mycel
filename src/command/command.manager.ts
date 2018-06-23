export interface CommandDescription {
    name : string,
    parameter : Array<string>
}

export class CommandManager {

    private commands : Array<CommandDescription> = [];

    /**
     * registers a new command
     * @param command the command data
     * @returns returns CommandManager
     */
    public register(command : CommandDescription) : CommandManager {
        if(this.get(command)){
            throw new Error('Command "' + name + '" allready exists!');
        }
        this.commands.push(command);
        return this;
    }

    /**
     * unregisters a command
     * @param name the command data
     */
    public unregister(command : CommandDescription) : CommandManager {
        this.commands = this.commands.filter((current) => current.name !== command.name);
        return this;
    }

    /**
     * find a command entry
     * @param command
     * @returns the command entry or null
     */
    public get(command : CommandDescription) : CommandDescription | null {
        return this.commands.find((current) => current.name === command.name);
    }

    /**
     * find a command entry by its name
     * @param name
     * @returns the command entry or null
     */
    public getByName(commandName : string): CommandDescription | null {
        return this.commands.find((current) => current.name === commandName);
    }

    /**
     * @returns an array with all commands
     */
    public getAll() : Array<CommandDescription>{
        return this.commands;
    }
}