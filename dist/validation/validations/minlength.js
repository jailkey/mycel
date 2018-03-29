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
const validation_message_1 = require("../validation.message");
/**
 * validation factory
 * @param len
 */
function MinLength(len) {
    return class MinLength {
        onValidate(value, target, property) {
            return __awaiter(this, void 0, void 0, function* () {
                if (value !== undefined && typeof value === 'string' && value.length >= len) {
                    return new validation_message_1.ValidationMessage(validation_message_1.ValidationMessageStates.success, null, property, target);
                }
                return new validation_message_1.ValidationMessage(validation_message_1.ValidationMessageStates.error, 'MinLength', property, target);
            });
        }
    };
}
exports.MinLength = MinLength;
//# sourceMappingURL=minlength.js.map