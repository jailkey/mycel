"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
class ModelHelper {
    static convertToModelPropertyData(data, model) {
        return __awaiter(this, void 0, void 0, function* () {
            let properties = yield model.properties();
            let relations = yield model.getRelations();
            for (let i = 0; i < properties.length; i++) {
                if (data.hasOwnProperty(properties[i].name)) {
                    properties[i].value = data[properties[i].name];
                }
            }
            return properties;
        });
    }
    static convertToPlainData(data) {
        let output = {};
        for (let entry of data) {
            output[entry.name] = entry.value;
        }
        return output;
    }
    static removeModelKey(value) {
        return (~value.indexOf('.')) ? value.split('.')[1] : value;
    }
    /**
     * removes the model keys from data
     * @param data
     */
    static removeModelKeys(data) {
        let output = {};
        for (let prop in data) {
            if (data.hasOwnProperty(prop)) {
                let key = ModelHelper.removeModelKey(prop);
                output[key] = data[prop];
            }
        }
        return output;
    }
    static getModelKey(data) {
        for (let prop in data) {
            if (~prop.indexOf('.')) {
                return prop.split('.')[0];
            }
        }
        return null;
    }
}
exports.ModelHelper = ModelHelper;
//# sourceMappingURL=model.helper.js.map