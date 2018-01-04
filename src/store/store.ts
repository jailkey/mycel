export interface Store {
    create(data : any) : Promise<any>
    read(resourceId : string) : Promise<any>
    update(resourceId : string, data : any) : Promise<boolean>
    remove(resourceId) : Promise<boolean>
    query(query : string) : Promise<Array<any>>
}