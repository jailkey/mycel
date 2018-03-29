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
const service_1 = require("./service");
const controller_1 = require("../controller/controller");
const command_data_1 = require("../command/command.data");
const service_request_1 = require("./service.request");
class TestController extends controller_1.Controller {
    constructor() {
        super(...arguments);
        this.namespace = "MyTestController";
    }
    myFirstCommand(hans) {
        return hans + ' said something';
    }
}
//TestController.commands.register(TestCommand)
describe('Service', () => {
    let service;
    let testController;
    let testCommand;
    it('creates a test controller and adds a testcommand', () => {
        testController = new TestController();
    });
    it('creates a new command and adds it to the controller', () => {
        testCommand = new command_data_1.CommandData('myFirstCommand', testController.myFirstCommand.bind(testController), ['hans']);
        testController.commands.register(testCommand);
    });
    it('creates a new service instance and registers the controller', () => {
        service = new service_1.Service();
        service.namespace = 'MyService';
        service.controller.register(testController);
    });
    describe('applyRequest()', () => {
        it('applies a new request to the service', (done) => __awaiter(this, void 0, void 0, function* () {
            let request = new service_request_1.ServiceRequest('MyService:MyTestController.myFirstCommand', {
                hans: 'peter'
            });
            let result = yield service.applyRequest(request);
            expect(result.acknowledged).toBeTruthy();
            expect(result.data).toBe('peter said something');
            done();
        }));
    });
});
//# sourceMappingURL=service.spec.js.map