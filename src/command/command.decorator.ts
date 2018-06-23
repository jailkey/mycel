import { CommandManager } from './command.manager';

export const COMMAND_MANAGER_PROPERTY_NAME = '__commands';

/**
 * the command decorator marks a method as command, so its callable via the service
 * @param target 
 * @param method 
 * @param descriptor 
 */
export function Command(target, property, descriptor){

    let descriptorValue = descriptor.value;

    let parameter : Array<string> = [];
    let parameterParts = descriptorValue.toString().split('(')[1].split(')')[0].trim();

    if(parameterParts){
        parameter = parameterParts.split(',').map(parameter => parameter.trim());
    }

    let commandManager : CommandManager;
    if(!target.hasOwnProperty(COMMAND_MANAGER_PROPERTY_NAME)){
        commandManager = new CommandManager();
        Object.defineProperty(target, COMMAND_MANAGER_PROPERTY_NAME, {
            value : commandManager,
            enumerable: false,
            configurable: true 
        });
    }else{
        commandManager = target[COMMAND_MANAGER_PROPERTY_NAME];
    }

    commandManager.register({
        name : property,
        parameter : parameter
    });
    
    return descriptor;
   
}