import { Service } from './service';
import { Controller } from '../controller/controller';
import { CommandData } from '../command/command.data';
import { ServiceRequest } from './service.request';

class TestController extends Controller {
    public namespace = "MyTestController";

    public myFirstCommand(hans : string) {
        return hans + ' said something';
    }
}


//TestController.commands.register(TestCommand)

describe('Service', () => {

    let service : Service;
    let testController : TestController;
    let testCommand : CommandData;

    it('creates a test controller and adds a testcommand', () => {
        testController = new TestController();
    })

    it('creates a new command and adds it to the controller', () => {
        testCommand = new CommandData(
            'myFirstCommand', 
            testController.myFirstCommand.bind(testController),
            ['hans']
        )
        testController.commands.register(testCommand);
    })

    it('creates a new service instance and registers the controller', () => {
        service = new Service();
        service.namespace = 'MyService';
        service.controller.register(testController);
    })

    describe('applyRequest()', () => {
        it('applies a new request to the service', async (done) => {
            let request = new ServiceRequest('MyService:MyTestController.myFirstCommand',  {
                hans : 'peter'
            })

            let result = await service.applyRequest(request);

            expect(result.acknowledged).toBeTruthy();
            expect(result.data).toBe('peter said something');
            done()
        })
    })
})


