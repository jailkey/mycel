"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class CommandManager {
    constructor() {
        this.commands = [];
    }
    /**
     * registers a new command
     * @param command the command data
     * @returns returns CommandManager
     */
    register(command) {
        if (this.get(command)) {
            throw new Error('Command "' + name + '" allready exists!');
        }
        this.commands.push(command);
        return this;
    }
    /**
     * unregisters a command
     * @param name the command data
     */
    unregister(command) {
        this.commands = this.commands.filter((current) => current.name !== command.name);
        return this;
    }
    /**
     * find a command entry
     * @param command
     * @returns the command entry or null
     */
    get(command) {
        return this.commands.find((current) => current.name === command.name);
    }
    /**
     * find a command entry by its name
     * @param name
     * @returns the command entry or null
     */
    getByName(commandName) {
        return this.commands.find((current) => current.name === commandName);
    }
    /**
     * @returns an array with all commands
     */
    getAll() {
        return this.commands;
    }
}
exports.CommandManager = CommandManager;
//# sourceMappingURL=command.manager.js.map