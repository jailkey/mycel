import { Model } from './model';
import { ModelOptions, ModelData } from './model.options.decorator';
import { FileStorage } from '../storage/file.storage';
import { StoragePermissions } from '../storage/storage.permissions';
import { AutoIncrement } from './model.autoincrement.decorator';
import { Index } from './model.index.decorator';
import { Validation } from './model.validation.decorator';
import { Require } from '../validation/validations/require';
import { Key } from './model.key.decorator';
import { Relation, RelationTypes } from '../relation/relation';

@ModelOptions({
    storage : new FileStorage({
        path : './tmp',
        name : 'my_sublist',
        permissions : new StoragePermissions(true, true)
    })
})
class RelationModel extends Model {

    @Key
    @AutoIncrement
    public id : number = 0;

    public someKey : string = '';
}


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

    @Key
    @AutoIncrement
    public id : number = 0;

    @Validation(Require)
    public firstName : string = null;

    @Validation(Require)
    public lastName : string = null;

   // @Relation(RelationModel, [ 'id' ], RelationTypes.M2N)
    public someEntries : Array<any> = [];
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

        it('creates an entry with a valid dataset.', async(done) => {
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

    describe('read()', () => {
        it('reads an entry by a given id.', async (done) => {
            let result = await model.read({ id : 0 });
            expect(result.id).toBe(0);
            expect(result.firstName).toBe('Hans');
            expect(result.lastName).toBe('Peter');
            done();
        });

        
    })

    describe('update()', () => {
        it('updates an entry by a given id.', async (done) => {
            let result = await model.update({ id : 0 }, { firstName : 'Dieter'});
            expect(result).toBeTruthy();
            done();
        })

        it('reads the updated entry to check if it realy contains the updates', async(done) => {
            let result = await model.read({ id : 0 });
            expect(result.firstName).toBe('Dieter');
            done();
        })

        it('tries to update a non existing value', async (done) => {
            try {
                let result = await model.update({ id : 10 }, { firstName : 'Dieter'});
            }catch(e){
                expect(e.message).toBe("Cannot set property 'firstName' of undefined");
                done();
            }
            
        })
    })

    describe('remove()', () => {
        it('removes a entry', async (done) => {
            let result = await model.remove({ id : 0 });
            expect(result).toBeTruthy();
            done();
        })

        it('checks if the entry was removed', async (done) => {
            let result = await model.read({ id : 0 })
            expect(result).toBeFalsy();
            done()
        })
    })

    describe('__storage.reset()', () => {
        it('resets the the test' , async() => {
            let result = await model.__storage.reset();
            expect(result).toBeTruthy();
        })
    })


      
})