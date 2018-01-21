import { StorageQuery, QueryConditionTypes } from './storage.query';

describe('StorageQuery', () => {
    let query;

    it('creats a new StorageQuery instance', () => {
        query = new StorageQuery();
    })

    describe('create()', () => {
        it('use create and test if it is in the query chain.', () => {
            query.create()
            expect(query.getQuery().action).toBe('create');
        })

        it('tries to use a second create.', () => {
            expect(() => query.create()).toThrowError();
        })
    })

    describe('where()', () => {
        it('creats a where condition', () => {
            query.where((data) => data.name === 'Hans');
            expect(typeof query.getQuery().condition.filter).toBe('function');
        })
    })

    describe('and()', () => {
        it('use and method to add a child condition.', () => {
            query.and((data) => data.lastname === 'Peter');
            expect(query.getQuery().condition.child.type).toBe(QueryConditionTypes.and);
        })
    })

    describe('or()', () => {
        it('use and method to or a child condition.', () => {
            query.or((data) => data.lastname === 'Dieter');
            expect(query.getQuery().condition.child.child.type).toBe(QueryConditionTypes.or);
        })
    })
})