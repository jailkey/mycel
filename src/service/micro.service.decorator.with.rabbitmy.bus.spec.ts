import { MicroService } from './micro.service.decorator';
import { Service } from './service';
import { Command } from '../command/command.decorator';
import { RabbitMqServiceConnector } from './rabbitmq.service.connector';
import { ServiceRequest } from './service.request';

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
    public myServiceCommand(test : string){
        return test;
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
    })
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
        let publishResult = await service.request(new ServiceRequest('TestServiceTwo.myServiceCommand', { test : 'irgendwas' }));
        console.log("publish Result", publishResult);
        expect(publishResult.testAswer).toBe('undso');
        done();
    })
})