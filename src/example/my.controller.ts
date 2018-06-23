/*
import { Controller, ControllerOptions, GetById, DeleteById, Overwrite} from '../controller/controller';
import { Command } from '../controller/command';
import { MyModel } from './my.model';
import { Readable } from '../controller/privileges';

@ControllerOptions({
    models : [
        MyModel,
        { 
            model : MyModel,
            privileges : [
                Readable
            ]
        }
    ]
})
export class MyController extends Controller {

    constructor(){
        super();
    }

    @Command()
    public async addition(one : number, two : number){
        return one + two;
    }


    @Command()
    public async getPresentationMyModel(){
        //return this.models(MyModel).presentations();
    }

    
    @Command()
    public async getUsersByName(name  : string){
       // return this.models(MyModel).query()
    }

    @Overwrite('MyController:presentation')
    public async anotherPresentation() {
        
    }

    @Listen(Listener)
    public async test(result : any){
        return 
    }

}
*/
//call
//Service:Controller:command, data { }

//model call
//Service:Controller:MyModel:presentation 
//Service:Controller:MyModel:create
//Service:Controller:MyModel:list { id : id }

