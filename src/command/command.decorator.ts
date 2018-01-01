import 'reflect-metadata';
import { CommandData } from './command.data';
import { MetaData, MetaDataTypes } from '../meta/meta.data';
import { MetaManager, MetaTypeInitialiser } from '../meta/meta.manager';

/**
 * the command decorator marks a method as command, so its callable via the service
 * @param target 
 * @param method 
 * @param descriptor 
 */
export function Command(target, method, descriptor){

    let descriptorValue = descriptor.value;

    let parameter : Array<string> = [];
    let parameterParts = descriptorValue.toString().split('(')[1].split(')')[0].trim();

    if(parameterParts){
        parameter = parameterParts.split(',').map(parameter => parameter.trim());
    }

    let metaData : MetaData = {
        target : target,
        type : MetaDataTypes.command,
        value : new CommandData(method, target[method].bind(target), parameter),
        property : method
    }

    MetaManager.set(target, metaData);

    return descriptor;
}

MetaTypeInitialiser.set(MetaDataTypes.command, (target, data) => {
    if(!target.commands){
        throw new Error('Can not add "@Command" decorator, class has no "commands" property');
    }
    target.commands.register(data.value)
    return target;
});
