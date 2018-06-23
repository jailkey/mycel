/*
import { Storage } from '../storage/storage';
import { Model } from './model.protoytpe';
import { CommandData } from '../command/command.data';

export interface ModelData {
    storage : Storage,
    commands? : Array<string> 
}

export function ModelOptions(options : ModelData){
    return function(target: any) {
        var original = target;

        function construct(constructor, args) {
  
            let newInstance : Model = new constructor(...args);
            newInstance.__storage = options.storage;

            //register default commands
            if(!options.commands || ~options.commands.indexOf('create')){
                newInstance.__commands.register(
                    new CommandData('create', newInstance.create.bind(newInstance), ['data'])
                )
            }

            if(!options.commands || ~options.commands.indexOf('read')){
                newInstance.__commands.register(
                    new CommandData('read', newInstance.read.bind(newInstance), ['resource'])
                )
            }

            if(!options.commands || ~options.commands.indexOf('update')){
                newInstance.__commands.register(
                    new CommandData('update', newInstance.update.bind(newInstance), ['resource', 'data'])
                )
            }

            if(!options.commands || ~options.commands.indexOf('remove')){
                newInstance.__commands.register(
                    new CommandData('remove', newInstance.remove.bind(newInstance), ['resource'])
                )
            }

            return newInstance;
        }

        var wrapped : any = function (...args) {
            return construct(original, args);
        }

        wrapped.prototype = original.prototype;
        wrapped.__name = target.name;
        return wrapped;
    }
}*/