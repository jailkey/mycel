"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const command_data_1 = require("./command.data");
const meta_data_1 = require("../meta/meta.data");
const meta_manager_1 = require("../meta/meta.manager");
/**
 * the command decorator marks a method as command, so its callable via the service
 * @param target
 * @param method
 * @param descriptor
 */
function Command(target, method, descriptor) {
    let descriptorValue = descriptor.value;
    let parameter = [];
    let parameterParts = descriptorValue.toString().split('(')[1].split(')')[0].trim();
    if (parameterParts) {
        parameter = parameterParts.split(',').map(parameter => parameter.trim());
    }
    let metaData = {
        target: target,
        type: meta_data_1.MetaDataTypes.command,
        value: new command_data_1.CommandData(method, target[method].bind(target), parameter),
        property: method
    };
    meta_manager_1.MetaManager.set(target, metaData);
    return descriptor;
}
exports.Command = Command;
meta_manager_1.MetaTypeInitialiser.set(meta_data_1.MetaDataTypes.command, (target, data) => {
    if (!target.commands) {
        throw new Error('Can not add "@Command" decorator, class has no "commands" property');
    }
    target.commands.register(data.value);
    return target;
});
//# sourceMappingURL=command.decorator.js.map