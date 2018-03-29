"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const command_helper_1 = require("./command.helper");
describe('CommandHelper', () => {
    let helper = new command_helper_1.CommandHelper();
    describe('checkCommandFormat()', () => {
        it('checks a well fromated string', () => {
            expect(helper.checkCommandFormat('Service:Controller.method')).toBeTruthy();
        });
        it('checks a wrong formated string', () => {
            expect(() => helper.checkCommandFormat('Service.Controller.method')).toThrowError();
        });
    });
    describe('convertToCommandChain()', () => {
        it('converts a command string to a command chain', () => {
            let commandChain = helper.convertToCommandChain('Service:Controller:SubController.method');
            expect(commandChain.name).toBe('Service');
            expect(commandChain.type).toBe(command_helper_1.CommandType.namespace);
            expect(commandChain.child.name).toBe('Controller');
            expect(commandChain.child.type).toBe(command_helper_1.CommandType.namespace);
            expect(commandChain.child.child.name).toBe('SubController');
            expect(commandChain.child.child.type).toBe(command_helper_1.CommandType.namespace);
            expect(commandChain.child.child.child.name).toBe('method');
            expect(commandChain.child.child.child.type).toBe(command_helper_1.CommandType.method);
        });
    });
});
//# sourceMappingURL=command.helper.spec.js.map