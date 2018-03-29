"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const meta_manager_1 = require("../meta/meta.manager");
const meta_data_1 = require("../meta/meta.data");
function Validation(validation) {
    return function (target, property, descriptor) {
        let metaData = {
            type: meta_data_1.MetaDataTypes.validation,
            target: target,
            property: property,
            value: validation
        };
        meta_manager_1.MetaManager.set(target, metaData);
        return descriptor;
    };
}
exports.Validation = Validation;
meta_manager_1.MetaTypeInitialiser.set(meta_data_1.MetaDataTypes.validation, (target, data) => {
    // do nothing at initialisation
    return target;
});
//# sourceMappingURL=model.validation.decorator.js.map