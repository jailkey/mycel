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
        path : './tmp/n2m',
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
        path : './tmp/n2m',
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
        path : './tmp/n2m',
        name : 'my_m2n_model_with_relation_test',
        permissions : new StoragePermissions(true, true)
    })
})
class MyN2MTestModel extends Model{

    @Key
    @AutoIncrement
    public id : number = 0;

    @Relation([RelationModelMTwoNOne, RelationModelMTwoNTwo], {
        type : RelationTypes.m2n,
        linking : LinkTypes.deep
    })
    public mTwoNRelation : ModelRelation = null;
}

describe('@Relations - Test n2m relations with deep linking', () => {
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
            console.log("E",e )
        }
        done();
    })

    it('test if the model entries are saved', async (done) => {
        let result = await model.read({ id : 0 });
        expect(result.mTwoNRelation[0].mTwoNTest).toBe('irgendwas')
        expect(result.mTwoNRelation[1].anders).toBe('wasanderes')
        done();
    })

    it('updates the model entries', async (done) => {
        let result = await model.update({ id : 0 }, {
            mTwoNRelation : [
                {
                    'RelationModelMTwoNOne.mTwoNTest' : 'somethingchanged'
                },
                {
                    'RelationModelMTwoNTwo.anders' : 'someotherthingchanged'
                }
            ]
        })
        done();
    })

    it('reads the updated data and checks it', async (done) => {
        let result = await model.read({ id : 0 });
        expect(result.mTwoNRelation[0].mTwoNTest).toBe('somethingchanged');
        expect(result.mTwoNRelation[1].anders).toBe('someotherthingchanged');
        done();
    });

    it('remove the entries', async (done) => {
        let result = await model.remove({ id : 0 });
        expect(result).toBeTruthy();
        done()
    })

    it('checks if all entries are removed', async (done) => {
        let result = await model.read({ id : 0 });
        expect(result).toBe(null);

        let subModelOne = new RelationModelMTwoNOne();
        let subResultOne = await subModelOne.read({ id : 0 });
        expect(subResultOne).toBe(null);

        let subModelTwo = new RelationModelMTwoNTwo();
        let subResultTwo = await subModelTwo.read({ id : 0 });
        expect(subResultTwo).toBe(null);

        done()
    })
})