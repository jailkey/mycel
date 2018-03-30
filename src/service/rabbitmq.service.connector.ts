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

    private queue : string;

    public async connect() {
        try {            
            this.connection = await amqplib.connect(this.options);
            return true;
        } catch(e){
            throw e;
        }
    }

    public async disconnect() {
        return true;
    }

    private getServiceFromCommand(command : string){
        if(~command.indexOf(':')){
            return command.split(':')[0];
        }
        return command.split('.')[0];
    }

    public async publish(request : ServiceRequest) : Promise<any>{
        return new Promise(async (resolve, reject) => {
            this.checkConnection();
            try {
                let queue = this.getServiceFromCommand(request.command);
                let channel = await this.connection.createChannel();
                let queueReady = await channel.assertQueue(queue)
                let result = await channel.sendToQueue(queue, new Buffer(JSON.stringify(request)));
                let responseQueue = queue + '.response';
                let queueOk = await channel.assertQueue(responseQueue);
                let consumResult = await channel.consume(responseQueue, (msg) => {
                    if(msg){
                        let response = JSON.parse(msg.content.toString());
                        if(response.uuid === request.uuid){
                            resolve(response.data.data)
                            channel.ack(msg);
                        }   
                    }
                });
            }catch(e){
                reject(e);
            }
        })
    }

    private handler : Array<Function> = [];

    private checkConnection(){
        if(!this.connection){
            throw new Error('Service is not connected!')
        }
    }

    public async subscribe(callback : Function){
        this.checkConnection();
        let channel = await this.connection.createChannel();
        let queueOk = await channel.assertQueue(this.queue);
        let consumResult = await channel.consume(this.queue, async (msg) => {
            if(msg){
                let incomingData = JSON.parse(msg.content.toString());
                let result = await callback(incomingData);
                channel.ack(msg);

                let responseQueue = this.queue + '.response';
                let answer = {
                    uuid : incomingData.uuid,
                    data : result
                }
                let queueReady = await channel.assertQueue(responseQueue);
                let sendResult = await channel.sendToQueue(responseQueue, new Buffer(JSON.stringify(answer)));
            }
        });
    }

    public setQueue(queue : string){
        this.queue = queue;
    }
}