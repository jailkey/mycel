import { Model } from '../model/model';
import { ModelOptions, ModelData } from '../model/model.options.decorator';
import { FileStorage } from '../storage/file.storage';
import { StoragePermissions } from '../storage/storage.permissions';
import { AutoIncrement } from '../model/model.autoincrement.decorator';
import { Index } from '../model/model.index.decorator';
import { Validation } from '../model/model.validation.decorator';
import { Require } from '../validation/validations/require';
import { Key } from '../model/model.key.decorator';
import { Relation, RelationTypes, ModelRelation, LinkTypes} from '../relation/relation';

@ModelOptions({
    storage : new FileStorage({
        path : './tmp',
        name : 'my_sub_relation_model_test',
        permissions : new StoragePermissions(true, true)
    })
})
class SubRelationAutoModel extends Model {

    @Key
    @AutoIncrement
    public id : number = 0;

    public subKey : string = '';
}


@ModelOptions({
    storage : new FileStorage({
        path : './tmp',
        name : 'my_relation_model_auto_linking_test',
        permissions : new StoragePermissions(true, true)
    })
})
class RelationAutoModel extends Model {

    @Key
    @AutoIncrement
    public id : number = 0;

    public someKey : string = '';

    @Relation(SubRelationAutoModel, { type : RelationTypes.one2one, linking : LinkTypes.auto })
    public subRelation : ModelRelation = null;
}



@ModelOptions({
    storage : new FileStorage({
        path : './tmp',
        name : 'my_relation_model_auto_linking_test',
        permissions : new StoragePermissions(true, true)
    })
})
class MyDecoratedRelationTestModel extends Model {

    constructor(){
        super();
    }

    @Key
    @AutoIncrement
    public id : number = 0;

    @Validation(Require)
    public firstName : string = null;

    @Validation(Require)
    public lastName : string = null;


    @Relation(RelationAutoModel, { type : RelationTypes.one2one, linking : LinkTypes.auto })
    public relationProperty : ModelRelation = null;

}

describe('@Relation', () => {
    let model : Model;
    it('creats a new model instance.', () => {
        model = new MyDecoratedRelationTestModel();
    })

    describe('test one2one relation with subrelation and deep linking.', () => {

        it('adds some data to the model.', async(done) => {
            let result = await model.create({
                firstName : 'Hans',
                lastName : 'Peter',
                relationProperty : {
                    'RelationModel.someKey' : 'something',
                    'RelationModel.subRelation' : {
                        'SubRealationMolde.subKey' : 'some other thing'
                    }
                }
            });
            done();
        })

        it('reads created data with realtion.', async(done) => {
            let result = await model.read({ id : 0 });
            expect(result.id).toBe(0);
            expect(result.firstName).toBe('Hans');
            expect(result.lastName).toBe('Peter');
            expect(result.relationProperty.id).toBe(0);
            expect(result.relationProperty.someKey).toBe('something');
            expect(result.relationProperty.subRelation.subKey).toBe('some other thing')
            done()
        })

        it('updates the data with relation', async(done) => {
            let result = await model.update({ id : 0}, {
                firstName : 'Dieter',
                relationProperty : {
                    'RelationModel.someKey' : 'anything'
                }
            })

            let readed = await model.read({ id : 0 });
            expect(readed.firstName).toBe('Dieter');
            expect(readed.relationProperty.someKey).toBe('anything');
            done();
        })

        it('updates the data with relation and subrelation', async(done) => {
            let result = await model.update({ id : 0}, {
                firstName : 'Peter',
                relationProperty : {
                    'RelationModel.subRelation' : {
                        'SubRealationMolde.subKey' : 'some things changed'
                    }
                }
            })

            let readed = await model.read({ id : 0 });
            expect(readed.firstName).toBe('Peter');
            expect(readed.relationProperty.subRelation.subKey).toBe('some things changed');
            done();
        })


        it('removes the created data with and its relation.', async(done) => {
            let result = await model.remove({ id : 0 });
            expect(result).toBeTruthy();
            result = await model.read({ id : 0 });
            expect(result).toBe(null);
            done();
        })

    });

    
})