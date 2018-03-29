"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
const controller_1 = require("./controller");
const controller_options_decorator_1 = require("./controller.options.decorator");
const command_decorator_1 = require("../command/command.decorator");
const command_helper_1 = require("../command/command.helper");
let ChildControllerWithNameSpace = class ChildControllerWithNameSpace extends controller_1.Controller {
    someNamespacedCommand() {
        return 'namespaced-command';
    }
};
__decorate([
    command_decorator_1.Command,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ChildControllerWithNameSpace.prototype, "someNamespacedCommand", null);
ChildControllerWithNameSpace = __decorate([
    controller_options_decorator_1.ControllerOptions({
        namespace: 'MyTestController'
    })
], ChildControllerWithNameSpace);
class ChildController extends controller_1.Controller {
    childControllerCommand() {
        return 'child-test';
    }
}
__decorate([
    command_decorator_1.Command,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ChildController.prototype, "childControllerCommand", null);
let MyDecoratedTestController = class MyDecoratedTestController extends controller_1.Controller {
    myTestComannd() {
        return 'comman-test';
    }
};
__decorate([
    command_decorator_1.Command,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], MyDecoratedTestController.prototype, "myTestComannd", null);
MyDecoratedTestController = __decorate([
    controller_options_decorator_1.ControllerOptions({
        namespace: 'MyMainController',
        controller: [
            ChildController,
            ChildControllerWithNameSpace
        ]
    })
], MyDecoratedTestController);
describe('Controller Options Decorator', () => {
    let controller;
    it('instantiates a new controller', () => {
        controller = new MyDecoratedTestController();
    });
    it('tests if all methods exists', () => {
        let allCommands = controller.commands.getAll();
        expect(allCommands.length).toBe(2);
        expect(allCommands[0].name).toBe('myTestComannd');
        expect(allCommands[1].name).toBe('childControllerCommand');
    });
    it('test to find the namespace controller command', () => {
        let commandHelper = new command_helper_1.CommandHelper();
        let commandChain = commandHelper.convertToCommandChain('MyTestController.someNamespacedCommand');
        let command = controller.findCommand(commandChain);
        expect(command.name).toBe('someNamespacedCommand');
    });
});
//# sourceMappingURL=controller.options.decorator.spec.js.map