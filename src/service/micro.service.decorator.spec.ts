import { MicroService } from './micro.service.decorator';
import { Service } from './service';
import { Controller } from '../controller/controller';
import { Command } from '../command/command.decorator';
import { ServiceRequest } from './service.request';

class TestController extends Controller {

    public namespace : string = 'MyController';

    @Command
    public myTestControllerMethod(test : string) {
        return 'controller' + test
    }
}

@MicroService({
    controller : [ TestController ]
})
class TestService extends Service {
    constructor(){
        super();
    }

    @Command
    public myServiceCommand(test : string){
        return test;
    }
}

describe('MicroService decorator', () => {
    let service;

    it('creates a new service', () => {
        service = new TestService();
    });

    it('tests if the added controller exists', () => {
        expect(service.controller.get(TestController) instanceof TestController).toBeTruthy()
    });

    it('tests requesting a decorated service command', async (done) => {
        let request = new ServiceRequest('TestService.myServiceCommand',  {
            test : 'somecontent'
        })

        let result = await service.applyRequest(request);
        expect(result.data).toBe('somecontent');
        expect(result.acknowledged).toBeTruthy();
        done()
    });

    it('tests requesting a decorated controller command', async (done) => {
        let request = new ServiceRequest('TestService:MyController.myTestControllerMethod',  {
            test : 'somecontent'
        })

        let result = await service.applyRequest(request);
        expect(result.data).toBe('controllersomecontent');
        expect(result.acknowledged).toBeTruthy();
        done()
    });
});