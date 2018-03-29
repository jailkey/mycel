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
const model_options_decorator_1 = require("./model.options.decorator");
const file_storage_1 = require("../storage/file.storage");
const storage_permissions_1 = require("../storage/storage.permissions");
const model_autoincrement_decorator_1 = require("./model.autoincrement.decorator");
const model_validation_decorator_1 = require("./model.validation.decorator");
const require_1 = require("../validation/validations/require");
const model_key_decorator_1 = require("./model.key.decorator");
let MyDecoratedTestModel = class MyDecoratedTestModel extends model_1.Model {
    constructor() {
        super();
        this.id = 0;
        this.firstName = null;
        this.lastName = null;
    }
};
__decorate([
    model_key_decorator_1.Key,
    model_autoincrement_decorator_1.AutoIncrement,
    __metadata("design:type", Number)
], MyDecoratedTestModel.prototype, "id", void 0);
__decorate([
    model_validation_decorator_1.Validation(require_1.Require),
    __metadata("design:type", String)
], MyDecoratedTestModel.prototype, "firstName", void 0);
__decorate([
    model_validation_decorator_1.Validation(require_1.Require),
    __metadata("design:type", String)
], MyDecoratedTestModel.prototype, "lastName", void 0);
MyDecoratedTestModel = __decorate([
    model_options_decorator_1.ModelOptions({
        storage: new file_storage_1.FileStorage({
            path: './tmp',
            name: 'my_decorated_model_test',
            permissions: new storage_permissions_1.StoragePermissions(true, true)
        })
    }),
    __metadata("design:paramtypes", [])
], MyDecoratedTestModel);
describe('@ModelOptions', () => {
    let model;
    describe('create a new model instance.', () => {
        model = new MyDecoratedTestModel();
    });
    describe('create()', () => {
        it('tries to create an invalid dataset.', (done) => __awaiter(this, void 0, void 0, function* () {
            try {
                let result = yield model.create({
                    firstName: 'Hans'
                });
            }
            catch (e) {
                expect(e.name).toBe('MyDecoratedTestModel');
                expect(e.validation.properties.firstName.isValid).toBeTruthy();
                expect(e.validation.properties.lastName.isValid).toBeFalsy();
            }
            finally {
                done();
            }
        }));
        it('creates an entry with a valid dataset.', (done) => __awaiter(this, void 0, void 0, function* () {
            try {
                let result = yield model.create({
                    firstName: 'Hans',
                    lastName: 'Peter'
                });
                expect(result).toBeTruthy();
                done();
            }
            catch (e) {
                console.log("E", e.validation.properties);
            }
        }));
    });
    describe('read()', () => {
        it('reads an entry by a given id.', (done) => __awaiter(this, void 0, void 0, function* () {
            let result = yield model.read({ id: 0 });
            expect(result.id).toBe(0);
            expect(result.firstName).toBe('Hans');
            expect(result.lastName).toBe('Peter');
            done();
        }));
    });
    describe('update()', () => {
        it('updates an entry by a given id.', (done) => __awaiter(this, void 0, void 0, function* () {
            let result = yield model.update({ id: 0 }, { firstName: 'Dieter' });
            expect(result).toBeTruthy();
            done();
        }));
        it('reads the updated entry to check if it realy contains the updates', (done) => __awaiter(this, void 0, void 0, function* () {
            let result = yield model.read({ id: 0 });
            expect(result.firstName).toBe('Dieter');
            done();
        }));
        it('tries to update a non existing value', (done) => __awaiter(this, void 0, void 0, function* () {
            let result = yield model.update({ id: 10 }, { firstName: 'Dieter' });
            expect(result).toBeFalsy();
            done();
        }));
    });
    describe('remove()', () => {
        it('removes a entry', (done) => __awaiter(this, void 0, void 0, function* () {
            let result = yield model.remove({ id: 0 });
            expect(result).toBeTruthy();
            done();
        }));
        it('checks if the entry was removed', (done) => __awaiter(this, void 0, void 0, function* () {
            let result = yield model.read({ id: 0 });
            expect(result).toBeFalsy();
            done();
        }));
    });
    describe('__storage.reset()', () => {
        it('resets the the test', () => __awaiter(this, void 0, void 0, function* () {
            let result = yield model.__storage.reset();
            expect(result).toBeTruthy();
        }));
    });
});
//# sourceMappingURL=model.options.decorator.spec.js.map