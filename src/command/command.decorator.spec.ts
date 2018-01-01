import { Command } from './command.decorator';
import { Controller } from '../controller/controller';

class TestControllerWithDecorator extends Controller {

    constructor() {
        super();
    }

    @Command
    public myCommand(param : string, something : string){
        return 'test'
    }

    @Command
    public anotherTestCommand(test : string){}

}

describe('Command Decorator', () => {
    let service = new TestControllerWithDecorator();

    it('tests if the controller has the first decorated command', () => {
        expect(service.commands.getByName('myCommand')).toBeTruthy();
        expect(service.commands.getByName('myCommand').parameter[0]).toBe('param');
        expect(service.commands.getByName('myCommand').parameter[1]).toBe('something');
        expect(service.commands.getByName('myCommand').reference()).toBe('test')
    })

    it('tests if the controller has the second decorated command', () => {
        expect(service.commands.getByName('anotherTestCommand')).toBeTruthy();
        expect(service.commands.getByName('anotherTestCommand').parameter[0]).toBe('test');
    })
})