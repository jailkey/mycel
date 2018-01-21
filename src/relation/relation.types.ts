export enum RelationTypes {
    one2one = 'one2one',
    one2n = 'one2n',
    m2n = 'm2n'
}

export enum RelationKeyTypes {
    list = 'List',
    auto = 'Auto'
}


export enum LinkTypes {
    deep = 'deep', //deletes relations / creates new entries in related table
    reference = 'reference', //create only references 
    auto = 'auto' //checks automaticly how to handle the relation
}