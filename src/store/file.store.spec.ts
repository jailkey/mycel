import { FileStore, FileStoreOptions} from './file.store';
import { StorePermissions } from './store.permissions';
import { ModelPropertyData } from '../model/model'

describe("FileStore", () => {
    let store;


    describe('constructor()', () => {
        it('creates an instance of FileStore', () => {
            store = new FileStore({
                path : './tmp',
                name : 'mytest',
                permissions : new StorePermissions(true, true)
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
            done();
        })
    })

    describe('read()', () => {
        it('reads an existing entry.', async(done) => {
            let entry = await store.read({ id : 0 });
            expect(entry.name).toBe('Hans');
            expect(entry.lastname).toBe('Peter');
            console.log("ENTRY", entry)
            done();
        })
    })

    describe('update()', () => {
        it('updates an existing entry', async (done) => {
            let result = await store.update({ id : 0 }, { name : 'Testmann'});
            expect(result).toBeTruthy();
            let entry = await store.read({ id : 0 });
            expect(entry.name).toBe('Testmann');
            done();
        })
    })

    describe('reset()', () => {
        it('resets the store', async (done) => {
            let result = await store.reset();
            done();
        })
    })
})