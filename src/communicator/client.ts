import * as net from 'net';
import { SocketCommandHandler } from './command/socket.command.handler';
import { SocketHandler } from './command/socket.handler';
import { DefaultClientMiddleware } from './middleware/default.client.middleware';
import { Command } from './command/command.decorator';

export interface MessageCueClientConfig {
    ip : string
    port : number
    timeout? : number
}

var clientCount = 0;




export class MessageCueClient {
    constructor(config : MessageCueClientConfig, namespace : string){
        this.config = config;
        this.namespace = namespace;
    }

    private config : MessageCueClientConfig;
    private socket : any;
    private clientCount : number =  clientCount++;
    public clientId : number;
    private socketHandler : SocketHandler;
    private namespace : string;

    public connect(){
        this.socket = new net.Socket();
        this.socketHandler = new SocketHandler(this.socket,  new SocketCommandHandler(this));
        console.log("connect to server", this.config, this.clientCount);
        this.handleErrors();
        this.handleTimeOut();
        this.socket.connect(this.config.port, this.config.ip, async () => {
            this.socketHandler.handleData(DefaultClientMiddleware);
            if(this.namespace){
                let result = await this.socketHandler.request({
                    command : 'Server.setNameSpace',
                    data : {
                        namespace : this.namespace
                    }
                })

            }
        });
    }

    public disconnect() {
        this.socket.destroy();
    }

    public async request(data : any) {
        return await this.socketHandler.request(data);
    }

    public async response(data : any) {
        return await this.socketHandler.response(data);
    }

    private requestId : number = 0;
    private createRequestId(){
        return this.requestId++;
    }

    @Command
    public async ping(){
        return 'pong_' + this.namespace;
    }


    private handleTimeOut(){
        if(this.config.timeout){
            this.socket.setTimeout(this.config.timeout);
            this.socket.on('timeout', () => {
                console.log("socket timeout")
                this.socket.end()
            })
        }
    }

    private handleErrors(){
        this.socket.on('close', () => {
            console.log('socket closed');
            this.socket.destroy();
            this.socket = null;
        });

        this.socket.on('error', (e) => {
            console.log('socket error', e);
            this.socket.destroy();
            this.socket = null;
        })
    }
}