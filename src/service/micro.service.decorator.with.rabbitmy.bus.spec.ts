import { MicroService } from './micro.service.decorator';
import { Service } from './service';
import { Command } from '../command/command.decorator';
import { RabbitMqServiceConnector, ConnectionError } from './rabbitmq.service.connector';
import { ServiceRequest } from './service.request';
import { Controller } from '../controller/controller';
import { ControllerOptions } from '../controller/controller.options.decorator';

@MicroService({
    connector : new RabbitMqServiceConnector({
        protocol : 'amqp',
        hostname : 'localhost',
        port : 5672,
        username : 'guest',
        password : 'guest',
        vhost : '/'
    })
})
class TestService extends Service {
    constructor(){
        super();
    }

    @Command
    public howAreYou(){
        return 'Im fine!';
    }
}

@ControllerOptions({})
class TestController extends Controller {

    public namespace : string = 'MyController';

    @Command
    public async myTestControllerMethod(test : string) {
        return 'controller-' + test
    }

}


@MicroService({
    connector : new RabbitMqServiceConnector({
        protocol : 'amqp',
        hostname : 'localhost',
        port : 5672,
        username : 'guest',
        password : 'guest',
        vhost : '/'
    }),
    controller : [ TestController ]
})
class TestServiceTwo extends Service {
    constructor(){
        super();
    }

    @Command
    public async myServiceCommand(test : string){
        return {
            testAswer : 'undso'
        };
    }
}

describe('RabbitMQ Microservice', () => {
    let service, serviceTwo;
    it('creates a new service and starts it', async (done) => {
        service = new TestService();
        serviceTwo = new TestServiceTwo();
        let serviceTwoResult = await serviceTwo.start();
        let result = await service.start();
        done();
    })

    it('request another service', async (done) => {
        let publishResult = await service.request(new ServiceRequest('TestServiceTwo.myServiceCommand', { test : 'irgendwas' }));
        console.log("publish Result", publishResult);
        expect(publishResult.testAswer).toBe('undso');
        done()
    })

    it('requests a controller command linked to a service', async (done) => {
        let publishResult = await service.request(new ServiceRequest('TestServiceTwo:MyController.myTestControllerMethod', { test : 'irgendwas' }));
        console.log("publisResult", publishResult)
        expect(publishResult).toBe('controller-irgendwas');
        done();
    })

    it('sends a message from controller two to controller one', async (done) =>  {
        let result = await serviceTwo.request(new ServiceRequest('TestService.howAreYou'));
        expect(result).toBe('Im fine!');
        done()
    });

    it('sends a message to a non existing controller', async (done) =>  {
        try {
            let result = await serviceTwo.request(new ServiceRequest('NotExistingService.howAreYou'));
        }catch(e){
            expect(e instanceof ConnectionError).toBeTruthy();
        }
        done();
    });

    it('resends a message to hopefully reconnected controller', async (done) =>  {
        let result = await serviceTwo.request(new ServiceRequest('TestService.howAreYou'));
        expect(result).toBe('Im fine!');
        done()
    });
})