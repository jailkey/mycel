import { Model } from '../model/model';
import { ModelOptions, ModelData } from '../model/model.options.decorator';
import { FileStorage } from '../storage/file.storage';
import { StoragePermissions } from '../storage/storage.permissions';
import { AutoIncrement } from '../model/model.autoincrement.decorator';
import { Index } from '../model/model.index.decorator';
import { Validation } from '../model/model.validation.decorator';
import { Require } from '../validation/validations/require';
import { Key } from '../model/model.key.decorator';
import { Relation, ModelRelation } from './relation';
import { RelationTypes, LinkTypes, RelationKeyTypes} from './relation.types';


@ModelOptions({
    storage : new FileStorage({
        path : './tmp',
        name : 'my_relation_model_m_two_n_deep_one_test',
        permissions : new StoragePermissions(true, true)
    })
})
class RelationModelMTwoNOne extends Model {
    constructor(){super();}

    @Key
    @AutoIncrement
    public id : number = 0;

    public mTwoNTest : string = '';

}

@ModelOptions({
    storage : new FileStorage({
        path : './tmp',
        name : 'my_relation_model_m_two_n_deep_two_test',
        permissions : new StoragePermissions(true, true)
    })
})
class RelationModelMTwoNTwo extends Model {
    constructor(){super();}

    @Key
    @AutoIncrement
    public id : number = 0;

    public anders : string = '';

}


@ModelOptions({
    storage : new FileStorage({
        path : './tmp',
        name : 'my_m2n_model_with_relation_test',
        permissions : new StoragePermissions(true, true)
    })
})
class MyN2MTestModel extends Model{

    @Relation([RelationModelMTwoNOne, RelationModelMTwoNTwo], {
        type : RelationTypes.m2n,
        linking : LinkTypes.deep
    })
    public mTwoNRelation : ModelRelation = null;
}

xdescribe('@Relations - Test n2m relations with deep linking', () => {
    let model : Model;
    it('creats a new model instance.', () => {
        model = new MyN2MTestModel();
    })

    it('create new model entries', async (done) => {
        try {
            let result = await model.create({
                mTwoNRelation : [
                    {
                        'RelationModelMTwoNOne.mTwoNTest' : 'irgendwas'
                    },
                    {
                        'RelationModelMTwoNTwo.anders' : 'wasanderes'
                    }
                ]
            
            })
        }catch(e){

        }
        done();
    })
})