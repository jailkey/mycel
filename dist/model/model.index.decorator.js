"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const meta_data_1 = require("../meta/meta.data");
const meta_manager_1 = require("../meta/meta.manager");
function Index(target, property) {
    let metaData = {
        type: meta_data_1.MetaDataTypes.index,
        target: target,
        property: property,
        value: true
    };
    meta_manager_1.MetaManager.set(target, metaData);
}
exports.Index = Index;
//# sourceMappingURL=model.index.decorator.js.map