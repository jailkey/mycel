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
    public id : '';

    @Validation(Require)
    public firstName : '';

    @Validation(Require)
    public lastName : '';
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
                    fistName : 'Hans'
                })
            }catch(e){
                console.log("e", e)
            }
            done()
        })
    })

      
})