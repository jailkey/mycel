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
const model_1 = require("./model");
class TestModel extends model_1.Model {
    constructor() {
        super(...arguments);
        this.myFirstProperty = 'test';
        this.anotherProperty = 10;
    }
}
describe('Model', () => {
    let model;
    it('creates a new model', () => {
        model = new TestModel();
    });
    describe('properties()', () => {
        it('gets all model properties', (done) => __awaiter(this, void 0, void 0, function* () {
            let properties = yield model.properties();
            expect(properties[0].name).toBe('myFirstProperty');
            expect(properties[1].name).toBe('anotherProperty');
            done();
        }));
    });
});
//# sourceMappingURL=model.spec.js.map