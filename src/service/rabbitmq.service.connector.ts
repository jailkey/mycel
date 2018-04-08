import { ServiceConnector, ServiceConnectorOptions, QuestionHandler } from './service.connector';
import { ServiceRequest } from './service.request';
import { ServiceResponse } from './service.response';
import * as amqplib from 'amqplib';
import { Connection, Channel } from 'amqplib';
import * as uuid from 'uuid';
import { EventEmitter } from 'events';

export interface ReconnectLogEntry {
    time : number;
    comment : string;
    data? : any;
}

export enum ConnectionErrorType {
    conectionClosed = 'conectionClosed',
    channelError = 'channelError',
    disconnected = 'disconnected',
    timeout = 'timeout'
}

export class ConnectionError extends Error {
    constructor(type : ConnectionErrorType, message : string){
        super()
        this.message = message;
        this.type = type;
    }

    public message : string;

    public type : ConnectionErrorType;
}

export class RabbitMqServiceConnector implements ServiceConnector {
    constructor(options : ServiceConnectorOptions) {
        this.options = options;
        this.timeout = options.timeout || this.timeout;
    }

    private timeout : number = 2000;

    private options : ServiceConnectorOptions;

    private connection : Connection;

    private queue : string;

    private channel : Channel;

    private reconnectLog : Array<ReconnectLogEntry> = [];

    public isConnected : boolean;

    private isConnecting : boolean;
 
    /**
     * connects the service to the rabbitmq server
     */
    public async connect() {
        try {

            this.connection = await amqplib.connect(this.options);
            this.channel = await this.connection.createChannel();

            this.channel.on('close', async (res) => {
                await this.handleError(ConnectionErrorType.conectionClosed, res);
            });

            this.channel.on('error', async(res) => {
                await this.handleError(ConnectionErrorType.channelError, res);
            });

            this.isConnected = true;
            return true;
        } catch(e){
            throw e;
        }
    }

    private async handleError(errorType : ConnectionErrorType, data : any){
        await this.disconnect();
        this.eventEmitter.emit('error', new ConnectionError(errorType, data))
        this.reconnectLog.push({
            time : new Date().getTime(),
            comment : errorType,
            data : data
        });
    }

    public async disconnect() {
        this.isConnected = false;
        this.connection = null;
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
            await this.checkConnection();
            try {
                let queue = this.getServiceFromCommand(request.command);
                let responseQueue = queue + '.response';
                let timeoutHandler = setTimeout(() => reject(new ConnectionError(ConnectionErrorType.timeout, 'Timeout while sending a request!')), this.timeout);
                let listenerId = await this.onQueue(responseQueue, async (msg) => {
                    if(msg){
                        clearTimeout(timeoutHandler);
                        let response = JSON.parse(msg.content.toString());
                        if(response.uuid === request.uuid){
                            this.offQueue(responseQueue, listenerId);
                            resolve(response.data.data);
                            return true;
                        }
                    }
                });
                let result = await this.channel.sendToQueue(queue, new Buffer(JSON.stringify(request)), {
                    replyTo: responseQueue 
                });
            }catch(e){
                reject(e);
            }
        })
    }

    private handler : Array<Function> = [];

    private async checkConnection(){
        if(!this.connection){
            this.reconnect()
            //throw new ConnectionError(ConnectionErrorType.disconnected, 'Service is disconnected!')
        }
        return true;
    }

    private async reconnect(){
        console.log("RECONNECT")
        await this.connect();
        let subscribtions = Array.from(this.subscribtions);
        this.subscribtions = [];
        subscribtions.forEach(this.subscribe);
    }

    private subscribtions : Array<Function> = [];

    public async subscribe(callback : Function){
        this.subscribtions.push(callback);
        await this.checkConnection();
        let listenerId = await this.onQueue(this.queue, async (msg) => {
            if(msg){
                let incomingData = JSON.parse(msg.content.toString());
                let result = await callback(incomingData);
                let responseQueue = this.queue + '.response';
                let answer = {
                    uuid : incomingData.uuid,
                    data : result
                }
                let sendResult = await this.channel.sendToQueue(responseQueue, new Buffer(JSON.stringify(answer)));
            }
        });
    }

    private queueListener : any = {};
    private async onQueue(queue : string, callback : Function){
        if(!this.queueListener[queue]){
            this.queueListener[queue] = [];
            await this.channel.assertQueue(queue);
            await this.channel.consume(queue, async (msg) => {
                if(await this.applyMessages(queue, msg)){
                    this.channel.ack(msg);
                }
            });
        }

        let listenerId = uuid();
        this.queueListener[queue].push({
            id : listenerId,
            callback : callback
        })

        return listenerId;
    }

    private async offQueue(queue : string, listenerId : string){
        this.queueListener[queue] = this.queueListener[queue].filter((current) => {
            return (current.id !== listenerId)
        })
    }

    private async applyMessages(queue : string, msg : any){
        let acknowleged = false;
        for(let current of this.queueListener[queue]){
            if(await current.callback(msg)){
                acknowleged = true;
            }
        }
        return acknowleged;
    }

    public setQueue(queue : string){
        this.queue = queue;
    }

    private eventEmitter : EventEmitter = new EventEmitter();

    public on(type : string, callback : any) {
        return this.eventEmitter.on(type, callback);
    }
}