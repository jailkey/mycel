"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const meta_data_1 = require("../meta/meta.data");
const meta_manager_1 = require("../meta/meta.manager");
function AutoIncrement(target, property) {
    let metaData = {
        type: meta_data_1.MetaDataTypes.autoIncrement,
        target: target,
        property: property,
        value: true
    };
    meta_manager_1.MetaManager.set(target, metaData);
}
exports.AutoIncrement = AutoIncrement;
//# sourceMappingURL=model.autoincrement.decorator.js.map