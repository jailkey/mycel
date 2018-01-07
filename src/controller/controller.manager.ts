import { Controller } from '../controller/controller';

interface ControllerCollection {
    (string) : Controller
}

interface Creator<T> {
    new (): T;
}


interface FindCallback {
   (controller : any) : boolean
}

export class ControllerManager {

    constructor(parent : any){
        this.parent = parent;
    }

    /**
     * includes the parent object 
     */
    private parent : any;

    private controllers : any = {};

     /**
     * registers a controller instance to the service
     * @param controller - a class that extends the Controller class
     */
    public register<T extends Controller>(controller : T){

        //if controller has no namespace, register all commands on the parent controller
        if(!controller.namespace){
            if(!this.parent.commands){
                throw new Error('Can not register parent command, because parent has no CommandManager.')
            }
            controller.commands.getAll().forEach(cmd => {
                this.parent.commands.register(cmd);
            });
           
        }
        this.controllers[controller.__name] = controller;
        return this;
    }

    /**
     * gets a controller by the controller class
     * @param controller - a controller class that should be instantiated, if the class do not exists it returns null
     */
    public get<T extends typeof Controller>(controller) : new() => T {
        let name = controller.__name || controller.name;
        if(!name){
            throw new Error('Something went wrong while getting the conroller, may be you try to get it by an instance not an class');
        }
        if(this.controllers[name]){
            return this.controllers[name];
        }
        throw new Error('Controller "' + name + '" is not registerd!');
    }

    /**
     * finds a controller by the specified callback
     * @param callback callback parameters is a controller instance 
     * @returns a controller or undefined
     */
    public find(callback : FindCallback) {
        for(let controllerName in this.controllers){
            if(
                this.controllers.hasOwnProperty(controllerName) 
                && callback(this.controllers[controllerName])
            ){
                return this.controllers[controllerName];
            }
        }
    }

    /**
     * checks if it has registerd controllers
     * @return true or false
     */
    public hasControllers(){
        for(let controllerName in this.controllers){
            if(this.controllers.hasOwnProperty(controllerName)) {
                return true;
            }
        }
        return false;
    }

    /**
     * unregisters a controller class from the service
     * @param controller 
     * @returns ControllerManager
     */
    public unregister<T extends typeof Controller>(controller : any){
        delete this.controllers[controller.__name];
        return this;
    }

}