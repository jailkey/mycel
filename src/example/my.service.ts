/* 
import { MicroService, Service } from '../service/service';
import { RestService, GET, POST, PUT, DELETE } from '../service/rest.service.decorator';
import { ModelFactory } from '../model/model';
import { MyController } from './my.controller';

/*
@MicroService({
    name : 'MyService',
    host : 'localhost',
    port : '4030',
    controller : [
        MyController
    ]
})
export class MyService extends Service{
    
}



@RestService({
    controller : [
        MyController
    ]
})
export class MyService extends Service {

    @GET('some/route/:id')
    public async getSomeRoute(parameter : any) {
        return this.controllers.get(MyController).getUsersByName('name')
    }
}


//service call MyService:login { username : 'myusername', passwort : 'passwort' }


    MyService:create:MyModel

    MyService:delete:MyModel { id : 'asdasdasdasd123123' }

    MyService:update:MyModel { id : '234234234' }
*/