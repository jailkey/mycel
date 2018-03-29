"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const controller_manager_1 = require("./controller.manager");
const controller_1 = require("./controller");
const service_1 = require("../service/service");
class TestController extends controller_1.Controller {
    constructor() {
        super();
        this.namespace = 'MyTestController';
    }
}
class UnRegisterdController extends controller_1.Controller {
    constructor() {
        super();
    }
}
class TestService extends service_1.Service {
}
describe('ControllerManager', () => {
    let controllerManager = new controller_manager_1.ControllerManager(new TestService);
    let testController = new TestController();
    describe('register()', () => {
        it('registers a new controller', () => {
            expect(controllerManager.register(testController)).toBe(controllerManager);
        });
    });
    describe('get()', () => {
        it('gets a controller instance from the service', () => {
            expect(controllerManager.get(TestController) instanceof TestController).toBeTruthy();
        });
        it('gets tries to get controller instance from a non registerd controller', () => {
            expect(() => controllerManager.get(UnRegisterdController)).toThrowError();
        });
    });
    describe('find()', () => {
        it('finds a controller instance my its namespace', () => {
            expect(controllerManager.find((controller) => {
                return controller.namespace === 'MyTestController';
            }) instanceof TestController).toBeTruthy();
        });
    });
    describe('hasController', () => {
        it('checks if there are registerd controllers', () => {
            expect(controllerManager.hasControllers()).toBeTruthy();
        });
    });
    describe('unregister()', () => {
        it('unregisters a controller from the service', () => {
            expect(() => controllerManager.unregister(testController).get(testController)).toThrowError();
        });
    });
});
//# sourceMappingURL=controller.manager.spec.js.map