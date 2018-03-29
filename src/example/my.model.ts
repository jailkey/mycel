/*
import { Model, ModelOptions } from '../model/model';
import { Presentation, InputField } from '../model/presentation'
import { Validation, Required, TextLen, EMail } from '../model/validations';
import { Store } from '../store/store';
import { MongoStore } from '../store/mogo.store';
import { RemoteRelation, Relation } from '../model/remote.model';
import { Readonly } from '../misc';

@ModelOptions({
    store : new MongoStore({
        name : 'MyModel'
    })
})
export class MyModel extends Model{
    
    @Validation(Required)
    @Validation(TextLen(256))
    @Presentation(InputField)
    public myMetaProperty : string;

    @Validation(EMail)
    public eMail : string;

    @Relation('User')
    public user : string;

    @Relation('SomeService:SomeController:listEntries')
    @Readonly()
    public someList : Array<any>;

    @Relation('User')
    public users : Array<string>;

    

}*/