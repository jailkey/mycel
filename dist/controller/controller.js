"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const controller_model_manager_1 = require("./controller.model.manager");
const controller_manager_1 = require("./controller.manager");
const command_manager_1 = require("../command/command.manager");
const command_helper_1 = require("../command/command.helper");
const meta_manager_1 = require("../meta/meta.manager");
//configurates a Controller
function ControllerOptions(config) {
    return config;
}
exports.ControllerOptions = ControllerOptions;
//controller superclass
class Controller {
    constructor() {
        this.models = new controller_model_manager_1.ModelManager(this);
        this.controller = new controller_manager_1.ControllerManager(this);
        this.commands = new command_manager_1.CommandManager();
        meta_manager_1.MetaManager.execute(this);
        this.__name = this.constructor.name;
    }
    /**
     * finds a controller command by a command chain
     * @param commandChain
     */
    findCommand(commandChain) {
        if (commandChain.type === command_helper_1.CommandType.namespace) {
            let foundedModel = this.models.getByName(commandChain.name);
            if (foundedModel) {
                if (commandChain.child.type === command_helper_1.CommandType.method) {
                    return foundedModel.__commands.getByName(commandChain.child.name);
                }
                else {
                    throw new Error('It is not possible to nest Models. (' + commandChain.child.name + ')');
                }
            }
            let foundedController = this.controller.find((controller) => controller.namespace === commandChain.name);
            if (!foundedController) {
                throw new Error('There is no registerd controller with namespace "' + commandChain.name + '"!');
            }
            if (commandChain.child.type === command_helper_1.CommandType.method) {
                return foundedController.commands.getByName(commandChain.child.name);
            }
            else if (commandChain.child.type === command_helper_1.CommandType.namespace) {
                return foundedController.findCommand(commandChain.child);
            }
        }
        else if (commandChain.type === command_helper_1.CommandType.method) {
            return this.commands.getByName(commandChain.name);
        }
    }
}
exports.Controller = Controller;
//# sourceMappingURL=controller.js.map