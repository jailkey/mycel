import { Model } from './model';
import { ModelOptions, ModelData } from './model.options.decorator';
import { FileStorage } from '../storage/file.storage';
import { StoragePermissions } from '../storage/storage.permissions';
import { AutoIncrement } from './model.autoincrement.decorator';
import { Index } from './model.index.decorator';
import { Validation } from './model.validation.decorator';
import { Require } from '../validation/validations/require';

@ModelOptions({
    storage : new FileStorage({
        path : './tmp',
        name : 'my_decorated_model_test',
        permissions : new StoragePermissions(true, true)
    })
})
class MyDecoratedTestModel extends Model {

    constructor(){
        super();
    }

    @Index
    @AutoIncrement
    public id : number = 0;

    @Validation(Require)
    public firstName : string = null;

    @Validation(Require)
    public lastName : string = null;
}


describe('@ModelOptions', () => {
    let model;

    describe('create a new model instance.', () => {
        model = new MyDecoratedTestModel();
    });

    describe('create()', () => {
        it('tries to create an invalid dataset.', async (done) => {
            try {
                let result = await model.create({
                    firstName : 'Hans'
                })
            }catch(e){
                expect(e.name).toBe('MyDecoratedTestModel');
                expect(e.validation.properties.firstName.isValid).toBeTruthy();
                expect(e.validation.properties.lastName.isValid).toBeFalsy();
            }finally{
                done();
            }
        })

        it('creates an entry with a valid dataset', async(done) => {
            try {
                let result = await model.create({
                    firstName : 'Hans',
                    lastName : 'Peter'
                })
                expect(result).toBeTruthy();
                done();
            }catch(e){
                console.log("E", e.validation.properties)
            }
           
            
        })
    })


      
})