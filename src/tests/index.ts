import { MicroService } from '../service/micro.service.decorator';
import { Service } from '../service/service';
import { Command } from '../command/command.decorator';
import { RabbitMqServiceConnector } from '../service/rabbitmq.service.connector';

@MicroService({
    connector : new RabbitMqServiceConnector({
        protocol : 'amqp',
        hostname : 'localhost',
        port : 5672,
        username : 'guest',
        password : 'guest'
        //vhost : '/'
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

let test = new TestService();

test.start();