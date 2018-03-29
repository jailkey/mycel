"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const storage_query_1 = require("./storage.query");
describe('StorageQuery', () => {
    let query;
    it('creats a new StorageQuery instance', () => {
        query = new storage_query_1.StorageQuery();
    });
    describe('create()', () => {
        it('use create and test if it is in the query chain.', () => {
            query.create();
            expect(query.getQuery().action).toBe('create');
        });
        it('tries to use a second create.', () => {
            expect(() => query.create()).toThrowError();
        });
    });
    describe('where()', () => {
        it('creats a where condition', () => {
            query.where((data) => data.name === 'Hans');
            expect(typeof query.getQuery().condition.filter).toBe('function');
        });
    });
    describe('and()', () => {
        it('use "and" method to add a child condition.', () => {
            query.and((data) => data.lastname === 'Peter');
            expect(query.getQuery().condition.child.type).toBe(storage_query_1.QueryConditionTypes.and);
        });
    });
    describe('or()', () => {
        it('use "or" method to or a child condition.', () => {
            expect(() => query.or((data) => data.lastname === 'Dieter')).toThrow();
        });
        it('creates a new query to use or.', () => {
            query = new storage_query_1.StorageQuery();
        });
    });
    describe('set()', () => {
        it('use the set method without a condition.', () => {
            expect(() => query.set({ mydata: 'test' })).toThrow();
        });
        it('use the "set" method with a condition.', () => {
            expect(() => query.where((entry) => entry.id === '1')).toThrow();
            query.update();
            query.where((entry) => entry.id === '1');
            query.set({ mydata: 'test' });
            expect(query.getQuery().condition.data.mydata).toBe('test');
        });
    });
    describe('copyAsReadable', () => {
        it('creates a readable copy', () => {
            query.and((entry) => entry.id === '2');
            let readable = query.copyAsReadable();
            let queryCopy = readable.getQuery();
            expect(queryCopy.action).toBe('read');
        });
    });
    describe('getChangedFields()', () => {
        it('gets all changed fileds', () => {
            query.where((entry) => entry.id === '1');
            query.set({ something: 'test' });
            let changedFields = query.getChangedFields();
            expect(changedFields[0]).toBe('mydata');
            expect(changedFields[1]).toBe('something');
        });
    });
});
//# sourceMappingURL=storage.query.spec.js.map