"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
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
const model_validation_decorator_1 = require("./model.validation.decorator");
const require_1 = require("../validation/validations/require");
const minlength_1 = require("../validation/validations/minlength");
class MyTestModel extends model_1.Model {
    constructor() {
        super();
        this.myProperty = '';
        this.anotherProperty = '';
    }
}
__decorate([
    model_validation_decorator_1.Validation(require_1.Require),
    __metadata("design:type", String)
], MyTestModel.prototype, "myProperty", void 0);
__decorate([
    model_validation_decorator_1.Validation(minlength_1.MinLength(5)),
    __metadata("design:type", String)
], MyTestModel.prototype, "anotherProperty", void 0);
describe('@Validation', () => {
    let model = new MyTestModel();
    it('tests if the first validation decorator is existing', (done) => __awaiter(this, void 0, void 0, function* () {
        let properties = yield model.properties();
        expect(properties[0].name).toBe('myProperty');
        expect(properties[0].validations[0].type).toBe('validation');
        expect(properties[0].validations[0].value === require_1.Require).toBeTruthy();
        done();
    }));
    it('tests if the second validation decorator is existing', (done) => __awaiter(this, void 0, void 0, function* () {
        let properties = yield model.properties();
        expect(properties[1].name).toBe('anotherProperty');
        expect(properties[1].validations[0].type).toBe('validation');
        done();
    }));
    it('it validates the properties and checks if they are invalid', (done) => __awaiter(this, void 0, void 0, function* () {
        let validations = yield model.validate();
        expect(validations.properties['myProperty'].isValid).toBeFalsy();
        expect(validations.properties['anotherProperty'].isValid).toBeFalsy();
        done();
    }));
    it('it validates the properties with data and checks if they are valid', (done) => __awaiter(this, void 0, void 0, function* () {
        let validations = yield model.validate({
            myProperty: 'something',
            anotherProperty: 'something'
        });
        expect(validations.properties['myProperty'].isValid).toBeTruthy();
        expect(validations.properties['anotherProperty'].isValid).toBeTruthy();
        done();
    }));
});
//# sourceMappingURL=model.validation.decorator.spec.js.map