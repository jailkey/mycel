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
/**
 * describes a command data object
 */
class CommandData {
    constructor(name, reference, parameter) {
        this.name = name;
        this.reference = reference;
        if (parameter) {
            this.parameter = parameter;
        }
    }
    execute(data) {
        return __awaiter(this, void 0, void 0, function* () {
            let parameterValues = this.parameter.map((current) => data[current]);
            return yield this.reference(...parameterValues);
        });
    }
}
exports.CommandData = CommandData;
//# sourceMappingURL=command.data.js.map