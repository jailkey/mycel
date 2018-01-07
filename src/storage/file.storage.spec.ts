import { FileStorage, FileStoreOptions} from './file.storage';
import { StoragePermissions } from './storage.permissions';
import { ModelPropertyData } from '../model/model'

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

    describe('reset()', () => {
        it('resets the store', async (done) => {
            let result = await store.reset();
            done();
        })
    })
})