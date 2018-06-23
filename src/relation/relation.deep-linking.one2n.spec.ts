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
        path : './tmp/one_2_n',
        name : 'my_sub_relation_model_test_one_2_n',
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
        path : './tmp/one_2_n',
        name : 'my_relation_model_one_two_n_deep_test',
        permissions : new StoragePermissions(true, true)
    })
})
class RelationModelOneTwoN extends Model {
    constructor(){super();}

    @Key
    @AutoIncrement
    public id : number = 0;

    public oneTwoNKey : string = '';

    public somethingElse : string = '';

    @Relation(SubRelationModel, { type : RelationTypes.one2one, linking : LinkTypes.deep })
    public subRelation : ModelRelation = null;
}


@ModelOptions({
    storage : new FileStorage({
        path : './tmp/one_2_n',
        name : 'my_model_with_relation_test_one_2_n',
        permissions : new StoragePermissions(true, true)
    })
})
class MyDecoratedRelationTestModel extends Model {

    constructor(){super();}

    @Key
    @AutoIncrement
    public id : number = 0;

    @Relation(RelationModelOneTwoN, { 
        type : RelationTypes.one2n, 
        linking : LinkTypes.deep,
        relationKeys : [ 'oneTwoNKey' ]
    })
    public oneTwoNRelation : ModelRelation = null;


}

describe('@Relation one2n', () => {
    let model : Model;
    it('creats a new model instance.', () => {
        model = new MyDecoratedRelationTestModel();
    })

    describe('test one2one relation with subrelation and deep linking.', () => {

        it('adds some data to the model.', async(done) => {
            try {
                let result = await model.create({

                    oneTwoNRelation : [
                        {
                            oneTwoNKey : 'mykey',
                            somethingElse : 'first entry',
                            subRelation : {
                                subKey : 'irgendwas'
                            }
                        },
                        {
                            oneTwoNKey : 'mykey',
                            somethingElse : 'second entry',
                            subRelation : {
                                subKey : 'nextlevel'
                            }
                        }
                    ]
                });
            }catch(e){
                console.error("e", e)
            }
            done();
        })

        it('reads created data with relation.', async(done) => {
            let result = await model.read({ id : 0 });
            expect(result.id).toBe(0);
            expect(Array.isArray(result.oneTwoNRelation)).toBeTruthy();
            expect(result.oneTwoNRelation[0].oneTwoNKey).toBe('mykey');
            expect(result.oneTwoNRelation[0].subRelation.subKey).toBe('irgendwas');
            done()
        })

        it('updates the data with relation', async(done) => {
            let result = await model.update({ id : 0}, {
                oneTwoNRelation : {
                    somethingElse : 'onetwonrealtionsupdated',
                    subRelation : {
                        subKey : 'hanspeter'
                    }
                }
            })
            
            let readed = await model.read({ id : 0 });
            
            expect(readed.oneTwoNRelation[0].somethingElse).toBe('onetwonrealtionsupdated');
            expect(readed.oneTwoNRelation[0].subRelation.subKey).toBe('hanspeter');
            done();
        })

        it('removes the created data with and its relation.', async(done) => {
            let result = await model.remove({ id : 0 });
            expect(result).toBeTruthy();
            result = await model.read({ id : 0 });
            expect(result).toBe(null);

            let relationModel = new RelationModelOneTwoN();
            let realtionResult = await relationModel.read({ id : 0 });
            expect(realtionResult).toBe(null);
            realtionResult = await relationModel.read({ id : 0 });
            expect(realtionResult).toBe(null);
            done();
        })

    });

    
})
*/