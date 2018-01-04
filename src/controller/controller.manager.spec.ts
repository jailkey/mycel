import { ControllerManager } from './controller.manager';
import { Controller } from './controller';
import { Service } from '../service/service';

class TestController extends Controller {
    constructor() {
        super();
    }

    public namespace : string = 'MyTestController'
}

class UnRegisterdController extends Controller{
    constructor() {
        super();
    }
}

class TestService extends Service {

}

describe('ControllerManager', () => {
    let controllerManager = new ControllerManager(new TestService);
    let testController = new TestController();

    describe('register()', () => {
        it('registers a new controller', () => {
            expect(controllerManager.register(testController)).toBe(controllerManager);
        })
    })

    describe('get()', () => {
        it('gets a controller instance from the service', () => {
            expect(controllerManager.get(TestController) instanceof TestController).toBeTruthy()
        })

        it('gets tries to get controller instance from a non registerd controller', () => {
            expect(() => controllerManager.get(UnRegisterdController)).toThrowError();
        })
    })

    describe('find()', () => {
        it('finds a controller instance my its namespace', () => {
            expect(controllerManager.find(
                (controller) => {
                    return controller.namespace === 'MyTestController' 
                }) instanceof TestController
            ).toBeTruthy()
        })
    })

    describe('hasController', () => {
        it('checks if there are registerd controllers', () => {
            expect(controllerManager.hasControllers()).toBeTruthy();
        })
    })

    describe('unregister()', () => {
        it('unregisters a controller from the service', () => {
            expect(() => controllerManager.unregister(testController).get(testController)).toThrowError();
        })
    });

})