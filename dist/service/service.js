"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const controller_manager_1 = require("../controller/controller.manager");
const middleware_manager_1 = require("../middleware/middleware.manager");
const service_response_1 = require("./service.response");
const command_helper_1 = require("../command/command.helper");
const command_manager_1 = require("../command/command.manager");
const meta_manager_1 = require("../meta/meta.manager");
class Service {
    constructor() {
        this.controller = new controller_manager_1.ControllerManager(this);
        this.middleware = new middleware_manager_1.MiddlwareManager();
        this.commands = new command_manager_1.CommandManager();
        //if namespace is not set, set classname as namespace
        if (!this.namespace) {
            this.namespace = this.constructor.name;
        }
        //initialise metadata
        meta_manager_1.MetaManager.execute(this);
    }
    /**
     * finds a command by a commandchain
     * @param commandChain
     * @returns a CommandData instance or null
     */
    findCommand(commandChain) {
        if (commandChain.name !== this.namespace) {
            throw new Error('The command namespace "' + commandChain.name + '" do not match the service namespace "' + this.namespace + '"');
        }
        if (commandChain.child.type === command_helper_1.CommandType.namespace) {
            let foundedController = this.controller.find((controller) => controller.namespace === commandChain.child.name);
            if (!foundedController) {
                throw new Error('There is no registerd controller with namespace "' + commandChain.child.name + '"!');
            }
            if (commandChain.child.child.type === command_helper_1.CommandType.method) {
                return foundedController.commands.getByName(commandChain.child.child.name);
            }
            else if (commandChain.child.child.type === command_helper_1.CommandType.namespace) {
                return foundedController.findCommand(commandChain.child.child);
            }
        }
        else if (commandChain.child.type === command_helper_1.CommandType.method) {
            return this.commands.getByName(commandChain.child.name);
        }
    }
    /**
     * applys a request to the service, if request command was found a ServiceResponse is returned else it throws an error
     * @async
     * @param request
     * @returns a Promise with ServiceResponse
     */
    applyRequest(request) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                request = yield this.middleware.applyRequest(request);
                let commandHelper = new command_helper_1.CommandHelper();
                //check the format, throws an error if it is wrong
                commandHelper.checkCommandFormat(request.command);
                let commandChain = commandHelper.convertToCommandChain(request.command);
                let command = this.findCommand(commandChain);
                if (!command) {
                    throw new Error('Can not find command "' + request.command + '"!');
                }
                let result = yield command.execute(request.data);
                return new service_response_1.ServiceResponse(true, result);
            }
            catch (e) {
                return new service_response_1.ServiceResponse(false, { error: e });
            }
        });
    }
    //start service
    start() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.connector) {
                yield this.connector.connect();
                return true;
            }
            else {
                throw new Error('No connector given!');
            }
        });
    }
    stop() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.connector) {
                yield this.connector.disconnect();
            }
        });
    }
}
exports.Service = Service;
//# sourceMappingURL=service.js.map