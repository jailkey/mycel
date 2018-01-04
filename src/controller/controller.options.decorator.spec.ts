import { Controller } from './controller';
import { ControllerOptions } from './controller.options.decorator';
import { Command } from '../command/command.decorator';
import { CommandHelper } from '../command/command.helper';


@ControllerOptions({
    namespace : 'MyTestController'
})
class ChildControllerWithNameSpace extends Controller {
    @Command
    public someNamespacedCommand() {
        return 'namespaced-command';
    }
}


class ChildController extends Controller {
    @Command
    public childControllerCommand(){
        return 'child-test'
    }
}

@ControllerOptions({
    namespace : 'MyMainController',
    controller : [ 
        ChildController,
        ChildControllerWithNameSpace
    ]
})
class MyDecoratedTestController extends Controller {

    @Command
    public myTestComannd() {
        return 'comman-test'
    }
}

describe('Controller Options Decorator', () => {
    let controller;

    it('instantiates a new controller', () => {
        controller = new MyDecoratedTestController();
    })

    it('tests if all methods exists', () => {
        console.log("controller", controller.commands.getAll())
        let allCommands = controller.commands.getAll();
        expect(allCommands.length).toBe(2);
        expect(allCommands[0].name).toBe('myTestComannd');
        expect(allCommands[1].name).toBe('childControllerCommand');
    })
    
    it('test to find the namespace controller command', () => {
        let commandHelper = new CommandHelper();
        let commandChain = commandHelper.convertToCommandChain('MyTestController.someNamespacedCommand');
        let command = controller.findCommand(commandChain);
        expect(command.name).toBe('someNamespacedCommand')
       
    })
})