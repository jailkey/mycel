import { MetaData, MetaDataTypes } from '../meta/meta.data';
import { MetaManager, MetaTypeInitialiser } from '../meta/meta.manager';

export function Index(target, property){
    let metaData : MetaData = {
        type : MetaDataTypes.index,
        target : target,
        property : property,
        value : true
    }
  
    MetaManager.set(target, metaData);
}