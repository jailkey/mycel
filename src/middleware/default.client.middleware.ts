import { CommandType, CommandData } from '../command/command.data';

export async function DefaultClientMiddleware(command : CommandData) {
    if(command.type === CommandType.request){
        command.data.socket = this.socket;
        let commandResult = await this.commandHandler.handleCommand(command);
        this.response({
            command : 'response',
            data : {
                requestId : command.data.requestId,
                requestIdOrigin : command.data.requestIdOrigin || null,
                result : commandResult
            }
        })
    }else if(command.type === CommandType.response){
        this.resolveRequest(command.data.requestId, command.data.result)
    }
}