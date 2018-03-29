"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ValidationMessageStates;
(function (ValidationMessageStates) {
    ValidationMessageStates["error"] = "error";
    ValidationMessageStates["success"] = "success";
})(ValidationMessageStates = exports.ValidationMessageStates || (exports.ValidationMessageStates = {}));
/**
 * validation message class
 */
class ValidationMessage {
    constructor(state, text, model, property) {
        this.state = state;
        this.property = property;
        this.model = model;
        this.text = text;
    }
}
exports.ValidationMessage = ValidationMessage;
//# sourceMappingURL=validation.message.js.map