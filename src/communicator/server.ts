import * as net from 'net';
import { SocketCommandHandler } from './command/socket.command.handler';
import { Command } from './command/command.decorator';
import { SocketHandler } from './command/socket.handler';
import { DefaultServerMiddleware } from './middleware/default.server.middleware';

export interface MessageCueServerConfig {
    ip : string
    port : number
}

export interface ClientDescription {
    namespace? : string;
    id : number;
    socket : any;
    port : number;
    ip : string;
}

export class MessageCueServer {
    constructor(config : MessageCueServerConfig){
        this.config = config;
    }

    private server : any;
    private socket : any;
    private config : MessageCueServerConfig;

    public start(){
        this.server = net.createServer(async (socket) => {
            this.socket = socket;
            this.handleErrors()
            //await this.handleData();
        });
        this.handleConnection()
        this.server.listen(this.config.port, this.config.ip);
    }

    private handleConnection(){
        this.server.on('connection', async socket => {
            console.log("CONNECTION -->", socket.remoteAddress + ':' + socket.remotePort)
            let clientConfig = this.registerClient(socket, socket.remoteAddress, socket.remotePort);
        })
    }

    private handleErrors() {
        this.server.on('error', (e) => {
            console.log("SERVER ERROR", e)
        })

    }

    @Command
    public async ping(){
        return 'pong';
    }

    @Command 
    public async setNameSpace(namespace : string, socket : any){
        let client = this.getClientBySocket(socket);
        client.namespace = namespace;
    }

    private getClientBySocket(socket : any) : ClientDescription {
        return this.clients.find((current) => current.socket === socket);
    }

    public getClientByNamespace(namespace : any): ClientDescription {
        return this.clients.find((current) => current.namespace === namespace);
    }

    private clients : Array<ClientDescription> = [];
    private clientIds : number = 0;

    private removeClientFromList(clientInfo : any) {
        delete clientInfo.socket;
        delete clientInfo.socketHandler;
        this.clients = this.clients.filter((current) => current.id !== clientInfo.id);

    }

    private registerClient(socket : any, port : number, ip : string){
        let clientId = this.getClientId();
        let clientInfo = {
            socket : socket,
            port : port,
            ip : ip,
            id : clientId,
            socketHandler : new SocketHandler(socket,  new SocketCommandHandler(this))
        }

        socket.on('close', () => {
            console.log("client closed")
            this.removeClientFromList(clientInfo);
        });

        socket.on('error', (e) => {
            console.log("client error", e)
        });

        this.clients.push(clientInfo);
        clientInfo.socketHandler.handleData(DefaultServerMiddleware(this.clients));
        return clientInfo;
    }

    public getClientId(){
        this.clientIds++;
        return this.clientIds;
    }

    public stop(){
        //this.server.
    }
}
