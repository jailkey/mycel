"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const meta_data_1 = require("../meta/meta.data");
var ModelPropertyInfoDataTypes;
(function (ModelPropertyInfoDataTypes) {
    ModelPropertyInfoDataTypes["validation"] = "validation";
    ModelPropertyInfoDataTypes["presentation"] = "presentation";
    ModelPropertyInfoDataTypes["index"] = "index";
})(ModelPropertyInfoDataTypes = exports.ModelPropertyInfoDataTypes || (exports.ModelPropertyInfoDataTypes = {}));
class ModelPropertyInfoData {
    constructor(target, property, infoType, value) {
        this.type = meta_data_1.MetaDataTypes.info;
        this.target = target;
        this.property = property;
        this.infoType = infoType;
        this.value = value;
    }
}
exports.ModelPropertyInfoData = ModelPropertyInfoData;
//# sourceMappingURL=model.property.info.data.js.map