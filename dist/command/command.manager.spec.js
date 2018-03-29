"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const command_manager_1 = require("./command.manager");
const command_data_1 = require("./command.data");
describe('CommandManager', () => {
    let commandManager = new command_manager_1.CommandManager();
    let TestCommand = new command_data_1.CommandData('myCommand', () => { }, ['hans']);
    let UnRegisterdCommand = new command_data_1.CommandData('myUnregisterdCommand', () => { }, ['hans']);
    describe('register()', () => {
        it('registers a test command', () => {
            commandManager.register(TestCommand);
        });
    });
    describe('get()', () => {
        it('gets a command', () => {
            expect(commandManager.get(TestCommand).name).toBe('myCommand');
        });
        it('tries to get a unregisterd command', () => {
            expect(commandManager.get(UnRegisterdCommand)).toBeUndefined();
        });
    });
    describe('unregisters a command', () => {
        it('unregisters a command', () => {
            expect(commandManager.unregister(TestCommand).get(TestCommand)).toBeUndefined();
        });
    });
});
//# sourceMappingURL=command.manager.spec.js.map