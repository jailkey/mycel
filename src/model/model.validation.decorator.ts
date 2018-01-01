import { OnValidate } from '../validation/validation.on.validate';
import { MetaManager, MetaTypeInitialiser } from '../meta/meta.manager';
import { MetaData, MetaDataTypes } from '../meta/meta.data';
import { PropertyInfoData } from '../meta/meta.property.info.data';
import { ModelPropertyInfoData, ModelPropertyInfoDataTypes} from './model.property.info.data';

export function Validation (validation : any) : Function {
    return function (target, property, descriptor) {

        let metaData : MetaData = {
            type : MetaDataTypes.validation,
            target : target,
            property : property,
            value : validation
        }
      
        MetaManager.set(target, metaData);
        //console.log("set metadara", target, metaData)

        return descriptor;
    }
}

MetaTypeInitialiser.set(MetaDataTypes.validation, (target, data) => {
    // do nothing at initialisation
    return target;
});