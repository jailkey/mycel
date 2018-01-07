import { MetaData, MetaDataTypes } from '../meta/meta.data';
import { MetaManager, MetaTypeInitialiser } from '../meta/meta.manager';

export function Key(target, property){
    let metaData : MetaData = {
        type : MetaDataTypes.key,
        target : target,
        property : property,
        value : true
    }
  
    MetaManager.set(target, metaData);
}