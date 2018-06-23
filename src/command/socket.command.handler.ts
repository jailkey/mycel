import { CommandManager } from './command.manager';
import { CommandData } from './command.data';
import { COMMAND_MANAGER_PROPERTY_NAME } from './command.decorator';


export class SocketCommandHandler {
    constructor(target : any){
        this.target = target;
    }

    private target  : any;

    public executeCommand(command : string) : CommandData {
        try {
            let commandObject = JSON.parse(command);
            return commandObject;
        }catch(e){
            console.error(e);
            throw new Error('Can not parse command!')
        }
    }

    public getTargetId(){
        return this.target.clientId;
    }

    private validateCommand(command : CommandData){

    }

    private getCommandParts(commandName : string){
        let parts = commandName.split('.');
        return {
            namespace : parts[0],
            command : parts[1]
        }
    }

    public async handleCommand(command : CommandData){
        let commandManager = this.target[COMMAND_MANAGER_PROPERTY_NAME] as CommandManager;
        if(!commandManager) {
            throw new Error('Target has no command manager!');
        }else{
            let commandParts = this.getCommandParts(command.command);
            let commadDescription = commandManager.getByName(commandParts.command);
            if(!commadDescription){
                throw new Error('Command not found! [' + command.command +']');
            }
            let parameterList = commadDescription.parameter || [];
            
            let parameter =  parameterList.map((current : string) => {
                return command.data[current];
            })
            if(this.target[commadDescription.name]){
                let result = await this.target[commadDescription.name].apply(this.target, parameter);

                return result;
            }else{
                throw new Error('Command does not exist on Target! [' + command.command +']');
            }
            
        }
    }
    
}