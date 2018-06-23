export enum CommandType {
    request = 'request',
    response = 'response'
}

export interface CommandData {
    command : string,
    type : CommandType,
    data? : any
}

export interface CommandRequest {
    command : string,
    data? : any
}