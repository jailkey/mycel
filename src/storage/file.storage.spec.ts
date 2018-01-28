import { FileStorage, FileStoreOptions} from './file.storage';
import { StoragePermissions } from './storage.permissions';
import { ModelPropertyData } from '../model/model';
import { StorageQuery } from './storage.query';

describe("FileStore", () => {
    let store;
    describe('constructor()', () => {
        it('creates an instance of FileStore', () => {
            store = new FileStorage({
                path : './tmp',
                name : 'mytest',
                permissions : new StoragePermissions(true, true)
            });
        })
    })

    describe('create()', () => {
        it('creats a storage entry.', async (done) => {
            let entry : Array<ModelPropertyData> = [
                new ModelPropertyData('id', null, { autoIncrement : true, index : true }),
                new ModelPropertyData('name', 'Hans'),
                new ModelPropertyData('lastname', 'Peter')
            ]
            await store.create(entry);

            let anotherEntry : Array<ModelPropertyData> = [
                new ModelPropertyData('id', null, { autoIncrement : true, index : true }),
                new ModelPropertyData('name', 'Klaus'),
                new ModelPropertyData('lastname', 'Dieter')
            ]
            await store.create(anotherEntry);
            done();
        })
    })

    describe('read()', () => {
        it('reads an existing entry.', async(done) => {
            let entry = await store.read({ id : 0 });
            expect(entry.name).toBe('Hans');
            expect(entry.lastname).toBe('Peter');
            done();
        })
    })

    describe('update()', () => {
        it('updates an existing entry', async (done) => {
            let result = await store.update({ id : 0 }, [ new ModelPropertyData('name', 'Testmann')]);
            expect(result).toBeTruthy();
            let entry = await store.read({ id : 0 });
            expect(entry.name).toBe('Testmann');
            done();
        })
    })

    describe('query()', () => {
        it('executes a query with read command and "and" condition!', async () => {
            
            let query = new StorageQuery();

            let result = await store.query(
                query
                    .read()
                    .where((data) => data.name === 'Testmann')
                    .and((data) => data.lastname == 'Peter')
            );
            
            expect(result.length).toBe(1);
            expect(result[0].name).toBe('Testmann');
        })

        it('executes a query with read command and "or" condition', async () => {  
            let secondQuery = new StorageQuery();

            let secondResult = await store.query(
                secondQuery
                    .read()
                    .where((data) => data.name === 'Testmann')
                    .or((data) => data.name === 'Klaus')
            );

            expect(secondResult.length).toBe(2);
            expect(secondResult[0].name).toBe('Testmann');
            expect(secondResult[1].name).toBe('Klaus');
        })

        it('executes a read query by with a list', async (done) => {
            let myQuery = new StorageQuery();
            let result = await(store.query(
                myQuery
                    .read()
                    .list([
                        {
                            name : 'Testmann'
                        },
                        {
                            name : 'Klaus'
                        }
                    ])
            ));
            expect(result.length).toBe(2);
            expect(result[0].name).toBe('Testmann');
            expect(result[1].name).toBe('Klaus');
            done()
        })
    })

    describe('reset()', () => {
        it('resets the store', async (done) => {
            let result = await store.reset();
            done();
        })
    })


    
})