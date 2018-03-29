"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var CommandType;
(function (CommandType) {
    CommandType["namespace"] = "namespace";
    CommandType["method"] = "methode";
})(CommandType = exports.CommandType || (exports.CommandType = {}));
class CommandHelper {
    /**
     * checks if the command string has the right format
     * @param command
     */
    checkCommandFormat(command) {
        //check chars 
        if (!/[a-zA-Z0-9\:\.]/g.test(command)) {
            throw new Error('Command string "' + command + '" contains illegal characters!');
        }
        //check method calls
        if (command.split('.').length !== 2) {
            throw new Error('Command string "' + command + '" contains more then one or no method call!');
        }
        return true;
    }
    /**
     * converts a command string into a command chain
     * @param command
     */
    convertToCommandChain(command) {
        let parts = command.split(':');
        let commandStructur;
        let lastCommand;
        for (let i = 0; i < parts.length; i++) {
            let currentCommand;
            if (i + 1 === parts.length) {
                let subParts = parts[i].split('.');
                if (subParts.length !== 2) {
                    throw new Error('Command string "' + command + '" contains a wrong method call!');
                }
                currentCommand = {
                    name: subParts[0],
                    type: CommandType.namespace,
                    child: {
                        name: subParts[1],
                        type: CommandType.method
                    }
                };
            }
            else {
                if (parts[i].includes('.')) {
                    throw new Error('Command string "' + command + '" contains a method call on the wrong position!');
                }
                currentCommand = {
                    name: parts[i],
                    type: CommandType.namespace
                };
            }
            if (lastCommand) {
                lastCommand.child = currentCommand;
            }
            else {
                commandStructur = currentCommand;
            }
            lastCommand = currentCommand;
        }
        return commandStructur;
    }
}
exports.CommandHelper = CommandHelper;
//# sourceMappingURL=command.helper.js.map