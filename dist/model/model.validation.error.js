"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ModelValidationError extends Error {
    constructor(message, name, validation) {
        super(message);
        this.message = message;
        this.name = name;
        this.validation = validation;
    }
}
exports.ModelValidationError = ModelValidationError;
//# sourceMappingURL=model.validation.error.js.map