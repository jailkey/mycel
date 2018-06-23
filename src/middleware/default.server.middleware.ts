import { DefaultClientMiddleware } from './default.client.middleware';
import { CommandType, CommandData } from '../command/command.data';

function splitCommand(command : string){
    let parts  = command.split('.');
    return {
        namespace : parts[0],
        command : parts[1]
    }
}

let instance = 0;

export function DefaultServerMiddleware (clientList) {
    return async function(command) {
        instance++;
        let commandParts = splitCommand(command.command);
        if(commandParts.namespace === 'Server'){
            await DefaultClientMiddleware.call(this, command);
        }else{
            if(command.type === CommandType.request){
                let currentClients = clientList.filter((current) => current.namespace === commandParts.namespace);
                let currentClient = currentClients[0];
                try {
                    let requestData ={
                        command : command.command,
                        data : command.data || {}
                    }
                    requestData.data.requestIdOrigin = command.data.requestId;
                    let commandResult = await currentClient.socketHandler.request(requestData);
                    this.response({
                        command : 'response',
                        data : {
                            requestId : command.data.requestIdOrigin || command.data.requestId,
                            result : commandResult
                        }
                    })
                }catch(e){
                    console.log("error", e)
                }
            }else if(command.type === CommandType.response){
                this.resolveRequest(command.data.requestId, command.data.result)
            }
        }
    }
}