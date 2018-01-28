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
    filter? : Function,
    data? : any
}

export interface QueryOrder {

}

export interface QueryDescription {
    action? : QueryActions
    condition? : QueryCondition
    order? : QueryOrder
    list? : Array<any>
    data? : Array<any>
}

export class StorageQuery {
    constructor(){};

    private query : QueryDescription;

    private nextCondition : QueryCondition;

    private lastCondition : QueryCondition;

    private listData : Array<any>;

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

    private checkAction(){
        if(!this.query.action){
            throw new Error('Query action should be set befor a condition!')
        }
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

    public set(data) {
        if(
            this.query.action !== QueryActions.create 
            && this.query.action !== QueryActions.update
        ){
            throw new Error('Set query can not be used with action "' + this.query.action + '"!');
        }

        if(!this.lastCondition){
            throw new Error('You can not use the "set" method without a condition!')
        }

        this.lastCondition.data = data;
        return this;
    }

    public list(data : Array<any>){
        if(this.nextCondition.type){
            throw new Error('You can not use a ListQuery together with a condition!');
        }
        this.query.list = data;
        return this;
    }

    public where(filter : Function){
        if(!filter || typeof filter !== 'function'){
            throw new Error('Filter in "where" condition is not defined!')
        }
        this.nextCondition.filter = filter;
        this.nextCondition.child = {};
        this.lastCondition = this.nextCondition;
        this.nextCondition = this.nextCondition.child;
        return this;
    }
    

    public and(filter : Function){
        if(!filter || typeof filter !== 'function'){
            throw new Error('Filter in "and" condition is not defined!')
        }
        this.nextCondition.type = QueryConditionTypes.and;
        this.nextCondition.filter = filter;
        this.nextCondition.child = {};
        this.lastCondition = this.nextCondition;
        this.nextCondition = this.nextCondition.child;
        return this;
    }

    public or(filter : Function){
        if(!filter || typeof filter !== 'function'){
            throw new Error('Filter in "or" condition is not defined!')
        }
        if(
            this.query.action === QueryActions.create 
        ){
            throw new Error('You can not use "or" with a "create" action!');
        }
        this.nextCondition.type = QueryConditionTypes.or;
        this.nextCondition.filter = filter;
        this.nextCondition.child = {};
        this.lastCondition = this.nextCondition;
        this.nextCondition = this.nextCondition.child;
        return this;
    }


    public getQuery() : QueryDescription {
        return this.query;
    }
}
