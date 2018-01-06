import { MetaData, MetaDataTypes } from '../meta/meta.data';
import { MetaManager, MetaTypeInitialiser } from '../meta/meta.manager';

export function AutoIncrement(target, property){
    let metaData : MetaData = {
        type : MetaDataTypes.autoIncrement,
        target : target,
        property : property,
        value : true
    }
  
    MetaManager.set(target, metaData);
}