import { MicroService } from './micro.service.decorator';
import { Service } from './service';
import { Controller } from '../controller/controller';
import { ControllerOptions } from '../controller/controller.options.decorator';
import { Command } from '../command/command.decorator';
import { ServiceRequest } from './service.request';
import { Model } from '../model/model';
import { ModelOptions } from '../model/model.options.decorator';
import { Key } from '../model/model.key.decorator';
import { AutoIncrement } from '../model/model.autoincrement.decorator';
import { FileStorage } from '../storage/file.storage';
import { StoragePermissions } from '../storage/storage.permissions';



@ModelOptions({
    storage : new FileStorage({
        path : './tmp',
        name : 'mico_service_test',
        permissions : new StoragePermissions(true, true)
    })
})
class MyTestModel extends Model {

    @Key
    @AutoIncrement
    public id : number = 0;

    public myTestPropery : string = null;

    
}

@ControllerOptions({
    models : [
        MyTestModel
    ]
})
class TestController extends Controller {

    public namespace : string = 'MyController';

    @Command
    public async myTestControllerMethod(test : string) {
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

describe('@MicroService', () => {
    let service;

    it('creates a new service.', () => {
        service = new TestService();
        expect(service).toBeTruthy();
    });

    it('tests if the added controller exists.', () => {
        expect(service.controller.get(TestController) instanceof TestController).toBeTruthy()
    });

    it('tests requesting a decorated service command.', async (done) => {
        let request = new ServiceRequest('TestService.myServiceCommand',  {
            test : 'somecontent'
        })
        let result = await service.applyRequest(request);
        expect(result.data).toBe('somecontent');
        expect(result.acknowledged).toBeTruthy();
        done()
    });

    it('tests requesting a decorated controller command.', async (done) => {

        let request = new ServiceRequest('TestService:MyController.myTestControllerMethod',  {
            test : 'somecontent'
        })

        let result = await service.applyRequest(request);
        expect(result.data).toBe('controllersomecontent');
        expect(result.acknowledged).toBeTruthy();
        done()
    });

    it('tests requesting the model commands', async (done) => {
        let request = new ServiceRequest('TestService:MyController:MyTestModel.create', {
            data : {
                myTestPropery : 'test'
            }
        })

        let result = await service.applyRequest(request);
        expect(result.data).toBeTruthy();
        let readResult = await service.applyRequest(
            new ServiceRequest('TestService:MyController:MyTestModel.read', { resource : { id : 0} })
        );
        expect(readResult.data.myTestPropery).toBe('test')
        expect(readResult.data.id).toBe(0)
        done()
    })

});