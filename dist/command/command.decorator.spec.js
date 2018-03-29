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
const command_decorator_1 = require("./command.decorator");
const controller_1 = require("../controller/controller");
class TestControllerWithDecorator extends controller_1.Controller {
    constructor() {
        super();
    }
    myCommand(param, something) {
        return 'test';
    }
    anotherTestCommand(test) { }
}
__decorate([
    command_decorator_1.Command,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], TestControllerWithDecorator.prototype, "myCommand", null);
__decorate([
    command_decorator_1.Command,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], TestControllerWithDecorator.prototype, "anotherTestCommand", null);
describe('Command Decorator', () => {
    let service = new TestControllerWithDecorator();
    it('tests if the controller has the first decorated command', () => {
        expect(service.commands.getByName('myCommand')).toBeTruthy();
        expect(service.commands.getByName('myCommand').parameter[0]).toBe('param');
        expect(service.commands.getByName('myCommand').parameter[1]).toBe('something');
        expect(service.commands.getByName('myCommand').reference()).toBe('test');
    });
    it('tests if the controller has the second decorated command', () => {
        expect(service.commands.getByName('anotherTestCommand')).toBeTruthy();
        expect(service.commands.getByName('anotherTestCommand').parameter[0]).toBe('test');
    });
});
//# sourceMappingURL=command.decorator.spec.js.map