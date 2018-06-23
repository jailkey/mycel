import { CommandRequest, CommandData, CommandType } from './command.data';
import { SocketCommandHandler } from './socket.command.handler';
import { Task } from '../task';

var requestId = 0;
export class SocketHandler {
    constructor(socket : any, commandHandler : SocketCommandHandler){
        this.socket = socket;
        this.commandHandler = commandHandler;
    }

    private socket : any;
    private commandHandler : SocketCommandHandler;

    private send(command){
        this.socket.write(JSON.stringify(command));
    }

    private getRequestId() {
        return (requestId++) + '-' + this.commandHandler.getTargetId() + '-' + new Date().getTime();
    }

    public requestStack : any = {};

    public async request(commandRequest : CommandRequest) {
        let command : CommandData = {
            command : commandRequest.command,
            type : CommandType.request,
            data : commandRequest.data || {},
        }

        command.data.requestId = commandRequest.command + this.getRequestId();
        this.requestStack[command.data.requestId] = Task();
        this.send(command);
        return this.requestStack[command.data.requestId].promise;
    }

    public async response(commandRequest : CommandRequest){
        let command : CommandData = {
            command : commandRequest.command,
            type : CommandType.response,
            data : commandRequest.data
        }
        this.send(command);
    }

    public resolveRequest(id : string, value : any){
        this.requestStack[id].resolve(value);
        delete this.requestStack[id];
    }

    public rejectRequest(id : string, error : any){
        this.requestStack[id].reject(error);
        delete this.requestStack[id];
    }

    public handleData(middleware : Function){
        this.socket.on('data', async (e) => {
            let command = this.commandHandler.executeCommand(e.toString());
            await middleware.call(this, command);
        })
    }
   

}