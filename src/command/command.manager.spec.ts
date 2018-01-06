import { CommandManager } from './command.manager';
import { CommandData } from './command.data';

describe('CommandManager', () => {
    let commandManager = new CommandManager();

    let TestCommand = new CommandData('myCommand', () => { }, ['hans']);
    let UnRegisterdCommand = new CommandData('myUnregisterdCommand', () => {},  ['hans']);

    describe('register()', () => {
        it('registers a test command', () => {
            commandManager.register(TestCommand);
        })
    })

    describe('get()', () => {
        it('gets a command', () => {
            expect(commandManager.get(TestCommand).name).toBe('myCommand');
        });

        it('tries to get a unregisterd command', ()=> {
            expect(commandManager.get(UnRegisterdCommand)).toBeUndefined();
        })
    })

    describe('unregisters a command', () => {
        it('unregisters a command', () => {
            expect(commandManager.unregister(TestCommand).get(TestCommand)).toBeUndefined();
        })
    })
})