"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const meta_data_1 = require("../meta/meta.data");
class ValidationData {
    constructor(target, property, value) {
        this.type = meta_data_1.MetaDataTypes.info;
        this.value = value;
        this.target = target;
        this.property = property;
    }
}
exports.ValidationData = ValidationData;
//# sourceMappingURL=validation.data.js.map