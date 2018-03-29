import { MicroService } from './micro.service.decorator';
import { Service } from './service';
import { Command } from '../command/command.decorator';
import { RabbitMqServiceConnector } from './rabbitmq.service.connector';

@MicroService({
    connector : new RabbitMqServiceConnector({
        protocol : 'amqp',
        hostname : '172.17.0.1',
//        port : 8080,
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

describe('RabbitMQ Microservice', () => {
    let service;
    it('creates a new service and starts it', async (done) => {
        service = new TestService();

        let result = await service.start();
        console.log("start result", result)
        done();
    })
})