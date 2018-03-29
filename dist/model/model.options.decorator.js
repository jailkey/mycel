"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const command_data_1 = require("../command/command.data");
function ModelOptions(options) {
    return function (target) {
        var original = target;
        function construct(constructor, args) {
            let newInstance = new constructor(...args);
            newInstance.__storage = options.storage;
            //register default commands
            if (!options.commands || ~options.commands.indexOf('create')) {
                newInstance.__commands.register(new command_data_1.CommandData('create', newInstance.create.bind(newInstance), ['data']));
            }
            if (!options.commands || ~options.commands.indexOf('read')) {
                newInstance.__commands.register(new command_data_1.CommandData('read', newInstance.read.bind(newInstance), ['resource']));
            }
            if (!options.commands || ~options.commands.indexOf('update')) {
                newInstance.__commands.register(new command_data_1.CommandData('update', newInstance.update.bind(newInstance), ['resource', 'data']));
            }
            if (!options.commands || ~options.commands.indexOf('remove')) {
                newInstance.__commands.register(new command_data_1.CommandData('remove', newInstance.remove.bind(newInstance), ['resource']));
            }
            return newInstance;
        }
        var wrapped = function (...args) {
            return construct(original, args);
        };
        wrapped.prototype = original.prototype;
        wrapped.__name = target.name;
        return wrapped;
    };
}
exports.ModelOptions = ModelOptions;
//# sourceMappingURL=model.options.decorator.js.map