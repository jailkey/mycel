import { ControllerManager } from '../controller/controller.manager';
import { MiddlwareManager } from '../middleware/middleware.manager';
import { ServiceRequest } from './service.request';
import { ServiceResponse } from './service.response';
import { CommandHelper, CommandChain, CommandType } from '../command/command.helper';
import { CommandManager } from '../command/command.manager';
import { CommandData } from '../command/command.data';
import { MetaManager } from '../meta/meta.manager';

export function MicroService(target : any) : any {
    
}

export class Service {

    constructor(){
        //if namespace is not set, set classname as namespace
        if(!this.namespace){
            this.namespace = this.constructor.name;
        }

        //initialise metadata
        MetaManager.execute(this);

    }

    public controller : ControllerManager = new ControllerManager(this);

    public middleware : MiddlwareManager = new MiddlwareManager();

    public commands : CommandManager = new CommandManager();

    public namespace : string;

    /**
     * finds a command by a commandchain
     * @param commandChain 
     * @returns a CommandData instance or null
     */
    public findCommand(commandChain : CommandChain) : CommandData {
        if(commandChain.name !== this.namespace){
            throw new Error('The command namespace "' + commandChain.name + '" do not match the service namespace "' + this.namespace + '"');
        }
        if(commandChain.child.type === CommandType.namespace){
            let foundedController = this.controller.find((controller) => controller.namespace === commandChain.child.name);
            if(!foundedController) {
                throw new Error('There is no registerd controller with namespace "' + commandChain.child.name + '"!');
            }

            if(commandChain.child.child.type === CommandType.method){
                return foundedController.commands.getByName(commandChain.child.child.name);
            }else if(commandChain.child.child.type === CommandType.namespace){
                return foundedController.findCommand(commandChain.child.child);
            }
        }else if(commandChain.child.type === CommandType.method){
            return this.commands.getByName(commandChain.child.name);
        }
        
    }

    /**
     * applys a request to the service, if request command was found a ServiceResponse is returned else it throws an error
     * @async
     * @param request
     * @returns a Promise with ServiceResponse
     */
    public async applyRequest(request : ServiceRequest) : Promise<ServiceResponse> {
        try {
            request = await this.middleware.applyRequest(request);
            let commandHelper : CommandHelper = new CommandHelper();

            //check the format, throws an error if it is wrong
            commandHelper.checkCommandFormat(request.command);
            
            let commandChain = commandHelper.convertToCommandChain(request.command);
            let command = this.findCommand(commandChain);
            if(!command){
                throw new Error('Can not find command "' + request.command + '"!')
            }
            let result = await command.execute(request.data);
            return new ServiceResponse(true, result);
        }catch(e){
            return new ServiceResponse(false, { error : e })
        }
    }
}