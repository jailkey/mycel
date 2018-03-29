"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ControllerManager {
    constructor(parent) {
        this.controllers = {};
        this.parent = parent;
    }
    /**
    * registers a controller instance to the service
    * @param controller - a class that extends the Controller class
    */
    register(controller) {
        //if controller has no namespace, register all commands on the parent controller
        if (!controller.namespace) {
            if (!this.parent.commands) {
                throw new Error('Can not register parent command, because parent has no CommandManager.');
            }
            controller.commands.getAll().forEach(cmd => {
                this.parent.commands.register(cmd);
            });
        }
        this.controllers[controller.__name] = controller;
        return this;
    }
    /**
     * gets a controller by the controller class
     * @param controller - a controller class that should be instantiated, if the class do not exists it returns null
     */
    get(controller) {
        let name = controller.__name || controller.name;
        if (!name) {
            throw new Error('Something went wrong while getting the conroller, may be you try to get it by an instance not an class');
        }
        if (this.controllers[name]) {
            return this.controllers[name];
        }
        throw new Error('Controller "' + name + '" is not registerd!');
    }
    /**
     * finds a controller by the specified callback
     * @param callback callback parameters is a controller instance
     * @returns a controller or undefined
     */
    find(callback) {
        for (let controllerName in this.controllers) {
            if (this.controllers.hasOwnProperty(controllerName)
                && callback(this.controllers[controllerName])) {
                return this.controllers[controllerName];
            }
        }
    }
    /**
     * checks if it has registerd controllers
     * @return true or false
     */
    hasControllers() {
        for (let controllerName in this.controllers) {
            if (this.controllers.hasOwnProperty(controllerName)) {
                return true;
            }
        }
        return false;
    }
    /**
     * unregisters a controller class from the service
     * @param controller
     * @returns ControllerManager
     */
    unregister(controller) {
        delete this.controllers[controller.__name];
        return this;
    }
}
exports.ControllerManager = ControllerManager;
//# sourceMappingURL=controller.manager.js.map