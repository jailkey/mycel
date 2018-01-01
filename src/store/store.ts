export function Store(target : any) : any{

}

export interface StoreInterface {
    open(resourceId : string) : Promise<any>
    create(resourceId : string, data : any) : Promise<any>
    save(resourceId : string, value : any) : Promise<boolean>
    remove(resourceId) : Promise<boolean>
    query(query : string) : Promise<Array<any>>
}