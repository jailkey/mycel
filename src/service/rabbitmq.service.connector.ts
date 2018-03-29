import { ServiceConnector, ServiceConnectorOptions, QuestionHandler } from './service.connector';
import { ServiceRequest } from './service.request';
import { ServiceResponse } from './service.response';
import * as amqplib from 'amqplib';
import { Connection } from 'amqplib';


export class RabbitMqServiceConnector implements ServiceConnector {
    constructor(options : ServiceConnectorOptions) {
        this.options = options;
    }

    private options : ServiceConnectorOptions;

    private connection : Connection;

    public async connect() {
        try {
            console.log("CONNECT")
            
            this.connection = await amqplib.connect(this.options);
            //result.then(() => { console.log('success') }, () => { console.log('error') })
            
            console.log("CONNECTTION RESULT", this.connection)
            return true;
        } catch(e){
            throw e;
        }
    }

    public async disconnect() {

        return true;
    }

    public async publish(request : ServiceRequest) : Promise<ServiceResponse>{
        this.checkConnection();
        try {
            let queue = 'tasks';
            let channel = await this.connection.createChannel();
            let queueReady = await channel.assertQueue(queue)
            let result = await channel.sendToQueue(queue, new Buffer('something to do'));

            console.log("result", result);
            /*
            let 
                return ch.assertQueue(q).then(function(ok) {
                return ch.sendToQueue(q, new Buffer('something to do'));
                });
            }).catch(console.warn);*/
            return new ServiceResponse(true);
        }catch(e){
            throw e;
        }
    }

    private handler : Array<Function> = [];

    private checkConnection(){
        if(!this.connection){
            throw new Error('Service is not connected!')
        }
    }

    public async subscribe(callback : QuestionHandler){
        this.checkConnection();
        let channel = await this.connection.createChannel();
        //this.handler.push()
    }
}