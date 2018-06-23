/*
import { Model } from '../model/model.protoytpe';
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
        name : 'my_sub_relation_model_test',
        permissions : new StoragePermissions(true, true)
    })
})
class SubRelationModel extends Model {

    @Key
    @AutoIncrement
    public id : number = 0;

    public subKey : string = '';
}

@ModelOptions({
    storage : new FileStorage({
        path : './tmp',
        name : 'my_relation_model_test',
        permissions : new StoragePermissions(true, true)
    })
})
class RelationModel extends Model {

    @Key
    @AutoIncrement
    public id : number = 0;

    public someKey : string = '';

    @Relation(SubRelationModel, { type : RelationTypes.one2one, linking : LinkTypes.deep })
    public subRelation : ModelRelation = null;
}




@ModelOptions({
    storage : new FileStorage({
        path : './tmp',
        name : 'my_model_with_relation_test',
        permissions : new StoragePermissions(true, true)
    })
})
class MyDecoratedRelationTestModel extends Model {

    constructor(){super();}

    @Key
    @AutoIncrement
    public id : number = 0;

    @Validation(Require)
    public firstName : string = null;

    @Validation(Require)
    public lastName : string = null;


    @Relation(RelationModel, { type : RelationTypes.one2one, linking : LinkTypes.deep })
    public relationProperty : ModelRelation = null;

}

xdescribe('@Relation', () => {
    let model : Model;
    it('creats a new model instance.', () => {
        model = new MyDecoratedRelationTestModel();
    })

    describe('test one2one relation with subrelation and deep linking.', () => {

        it('adds some data to the model.', async(done) => {
            try {
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
            }catch(e){
                console.error("e", e)
            }
            done();
        })

        it('reads created data with relation.', async(done) => {
            let result = await model.read({ id : 0 });
            expect(result.id).toBe(0);
            expect(result.firstName).toBe('Hans');
            expect(result.lastName).toBe('Peter');
            expect(result.relationProperty.id).toBe(0);
            expect(result.relationProperty.someKey).toBe('something');
            expect(result.relationProperty.subRelation.subKey).toBe('some other thing');
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
                firstName : 'NewName',
                relationProperty : {
                    'RelationModel.subRelation' : {
                        'SubRealationMolde.subKey' : 'some things changed'
                    }
                }
            })

            let readed = await model.read({ id : 0 });
            expect(readed.firstName).toBe('NewName');
            expect(readed.relationProperty.subRelation.subKey).toBe('some things changed');
            done();
        })


        it('removes the created data with and its relation.', async(done) => {
            let result = await model.remove({ id : 0 });
            expect(result).toBeTruthy();
            result = await model.read({ id : 0 });
            expect(result).toBe(null);
            done()
        })

    });

    
})
*/