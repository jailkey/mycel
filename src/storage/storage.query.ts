export enum QueryActions {
    create = 'create',
    read = 'read',
    update = 'update',
    remove = 'remove'
}

export enum QueryConditionTypes {
    and = 'and',
    or = 'or'
}

export enum QueryConditionHandler {
    equal = 'equal',
    startsWith = 'startWith',
    endsWith = 'endsWith'
}

export interface QueryCondition {
    type? : QueryConditionTypes
    child? : QueryCondition
    filter?: Function
}

export interface QueryOrder {

}

export interface QueryDescription {
    action? : QueryActions
    condition? : QueryCondition
    order? : QueryOrder
}

export class StorageQuery {
    constructor(){};

    private query : QueryDescription;

    private nextCondition : QueryCondition;

    private addAction(action : QueryActions){
        if(this.query){
            throw new Error('Only one action per storage query is allowed!')
        }

        this.query = {
            action : action,
            condition : {}
        }

        this.nextCondition = this.query.condition;
    }


    public create() : StorageQuery{
        this.addAction(QueryActions.create);
        return this;
    }

    public read() : StorageQuery {
        this.addAction(QueryActions.read);
        return this;
    }

    public update() : StorageQuery {
        this.addAction(QueryActions.update);
        return this;
    }

    public remove() : StorageQuery {
        this.addAction(QueryActions.update);
        return this;
    }

    public where(filter : any){
        this.nextCondition.filter = filter;
        this.nextCondition.child = {};
        this.nextCondition = this.nextCondition.child;
        return this;
    }
    

    public and(filter : any){
        this.nextCondition.type = QueryConditionTypes.and;
        this.nextCondition.filter = filter;
        this.nextCondition.child = {};
        this.nextCondition = this.nextCondition.child;
        return this;
    }

    public or(filter : any){
        this.nextCondition.type = QueryConditionTypes.or;
        this.nextCondition.filter = filter;
        this.nextCondition.child = {};
        this.nextCondition = this.nextCondition.child;
        return this;
    }


    public getQuery() : QueryDescription {
        return this.query;
    }
}
