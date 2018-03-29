"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const file_storage_1 = require("./file.storage");
const storage_permissions_1 = require("./storage.permissions");
const model_1 = require("../model/model");
const storage_query_1 = require("./storage.query");
describe("FileStore", () => {
    let store;
    describe('constructor()', () => {
        it('creates an instance of FileStore', () => {
            store = new file_storage_1.FileStorage({
                path: './tmp',
                name: 'mytest',
                permissions: new storage_permissions_1.StoragePermissions(true, true)
            });
        });
    });
    describe('create()', () => {
        it('creats a storage entry.', (done) => __awaiter(this, void 0, void 0, function* () {
            let entry = [
                new model_1.ModelPropertyData('id', null, { autoIncrement: true, index: true }),
                new model_1.ModelPropertyData('name', 'Hans'),
                new model_1.ModelPropertyData('lastname', 'Peter')
            ];
            yield store.create(entry);
            let anotherEntry = [
                new model_1.ModelPropertyData('id', null, { autoIncrement: true, index: true }),
                new model_1.ModelPropertyData('name', 'Klaus'),
                new model_1.ModelPropertyData('lastname', 'Dieter')
            ];
            yield store.create(anotherEntry);
            done();
        }));
    });
    describe('read()', () => {
        it('reads an existing entry.', (done) => __awaiter(this, void 0, void 0, function* () {
            let entry = yield store.read({ id: 0 });
            expect(entry.name).toBe('Hans');
            expect(entry.lastname).toBe('Peter');
            done();
        }));
    });
    describe('update()', () => {
        it('updates an existing entry', (done) => __awaiter(this, void 0, void 0, function* () {
            let result = yield store.update({ id: 0 }, [new model_1.ModelPropertyData('name', 'Testmann')]);
            expect(result).toBeTruthy();
            let entry = yield store.read({ id: 0 });
            expect(entry.name).toBe('Testmann');
            done();
        }));
    });
    describe('query()', () => {
        it('executes a query with read command and "and" condition!', () => __awaiter(this, void 0, void 0, function* () {
            let query = new storage_query_1.StorageQuery();
            let result = yield store.query(query
                .read()
                .where((data) => data.name === 'Testmann')
                .and((data) => data.lastname == 'Peter'));
            expect(result.length).toBe(1);
            expect(result[0].name).toBe('Testmann');
        }));
        it('executes a query with read command and "or" condition', () => __awaiter(this, void 0, void 0, function* () {
            let secondQuery = new storage_query_1.StorageQuery();
            let secondResult = yield store.query(secondQuery
                .read()
                .where((data) => data.name === 'Testmann')
                .or((data) => data.name === 'Klaus'));
            expect(secondResult.length).toBe(2);
            expect(secondResult[0].name).toBe('Testmann');
            expect(secondResult[1].name).toBe('Klaus');
        }));
        it('executes a read query by with a list', (done) => __awaiter(this, void 0, void 0, function* () {
            let myQuery = new storage_query_1.StorageQuery();
            let result = yield store.query(myQuery
                .read()
                .list([
                {
                    name: 'Testmann'
                },
                {
                    name: 'Klaus'
                }
            ]));
            expect(result.length).toBe(2);
            expect(result[0].name).toBe('Testmann');
            expect(result[1].name).toBe('Klaus');
            done();
        }));
        it('updates a query, with conditions', (done) => __awaiter(this, void 0, void 0, function* () {
            let myQuery = new storage_query_1.StorageQuery();
            let result = yield store.query(myQuery
                .update()
                .where((entry) => entry.name === 'Testmann')
                .set(new model_1.ModelPropertyData('lastname', 'was anderes'))
                .or(entry => entry.name === 'Klaus')
                .set(new model_1.ModelPropertyData('name', 'Noch so ein Typ')));
            let entry = yield store.read({ id: 0 });
            expect(entry.lastname).toBe('was anderes');
            let secondEntry = yield store.read({ id: 1 });
            expect(secondEntry.name).toBe('Noch so ein Typ');
            done();
        }));
    });
    describe('reset()', () => {
        it('resets the store', (done) => __awaiter(this, void 0, void 0, function* () {
            let result = yield store.reset();
            done();
        }));
    });
});
//# sourceMappingURL=file.storage.spec.js.map