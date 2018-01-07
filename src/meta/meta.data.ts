export enum MetaDataTypes {
    command = 'command',
    info = 'info',
    validation = 'validation',
    presentation = 'presentation',
    index = 'index',
    autoIncrement = 'autoIncrement',
    key = 'key'
}

export interface MetaData {
    type : MetaDataTypes,
    value : any,
    target : any,
    property? : string
}