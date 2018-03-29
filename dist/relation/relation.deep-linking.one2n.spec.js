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
const model_1 = require("../model/model");
const model_options_decorator_1 = require("../model/model.options.decorator");
const file_storage_1 = require("../storage/file.storage");
const storage_permissions_1 = require("../storage/storage.permissions");
const model_autoincrement_decorator_1 = require("../model/model.autoincrement.decorator");
const model_key_decorator_1 = require("../model/model.key.decorator");
const relation_1 = require("./relation");
const relation_types_1 = require("./relation.types");
let SubRelationModel = class SubRelationModel extends model_1.Model {
    constructor() {
        super(...arguments);
        this.id = 0;
        this.subKey = '';
    }
};
__decorate([
    model_key_decorator_1.Key,
    model_autoincrement_decorator_1.AutoIncrement,
    __metadata("design:type", Number)
], SubRelationModel.prototype, "id", void 0);
SubRelationModel = __decorate([
    model_options_decorator_1.ModelOptions({
        storage: new file_storage_1.FileStorage({
            path: './tmp/one_2_n',
            name: 'my_sub_relation_model_test_one_2_n',
            permissions: new storage_permissions_1.StoragePermissions(true, true)
        })
    })
], SubRelationModel);
let RelationModelOneTwoN = class RelationModelOneTwoN extends model_1.Model {
    constructor() {
        super();
        this.id = 0;
        this.oneTwoNKey = '';
        this.somethingElse = '';
        this.subRelation = null;
    }
};
__decorate([
    model_key_decorator_1.Key,
    model_autoincrement_decorator_1.AutoIncrement,
    __metadata("design:type", Number)
], RelationModelOneTwoN.prototype, "id", void 0);
__decorate([
    relation_1.Relation(SubRelationModel, { type: relation_types_1.RelationTypes.one2one, linking: relation_types_1.LinkTypes.deep }),
    __metadata("design:type", relation_1.ModelRelation)
], RelationModelOneTwoN.prototype, "subRelation", void 0);
RelationModelOneTwoN = __decorate([
    model_options_decorator_1.ModelOptions({
        storage: new file_storage_1.FileStorage({
            path: './tmp/one_2_n',
            name: 'my_relation_model_one_two_n_deep_test',
            permissions: new storage_permissions_1.StoragePermissions(true, true)
        })
    }),
    __metadata("design:paramtypes", [])
], RelationModelOneTwoN);
let MyDecoratedRelationTestModel = class MyDecoratedRelationTestModel extends model_1.Model {
    constructor() {
        super();
        this.id = 0;
        this.oneTwoNRelation = null;
    }
};
__decorate([
    model_key_decorator_1.Key,
    model_autoincrement_decorator_1.AutoIncrement,
    __metadata("design:type", Number)
], MyDecoratedRelationTestModel.prototype, "id", void 0);
__decorate([
    relation_1.Relation(RelationModelOneTwoN, {
        type: relation_types_1.RelationTypes.one2n,
        linking: relation_types_1.LinkTypes.deep,
        relationKeys: ['oneTwoNKey']
    }),
    __metadata("design:type", relation_1.ModelRelation)
], MyDecoratedRelationTestModel.prototype, "oneTwoNRelation", void 0);
MyDecoratedRelationTestModel = __decorate([
    model_options_decorator_1.ModelOptions({
        storage: new file_storage_1.FileStorage({
            path: './tmp/one_2_n',
            name: 'my_model_with_relation_test_one_2_n',
            permissions: new storage_permissions_1.StoragePermissions(true, true)
        })
    }),
    __metadata("design:paramtypes", [])
], MyDecoratedRelationTestModel);
describe('@Relation one2n', () => {
    let model;
    it('creats a new model instance.', () => {
        model = new MyDecoratedRelationTestModel();
    });
    describe('test one2one relation with subrelation and deep linking.', () => {
        it('adds some data to the model.', (done) => __awaiter(this, void 0, void 0, function* () {
            try {
                let result = yield model.create({
                    oneTwoNRelation: [
                        {
                            oneTwoNKey: 'mykey',
                            somethingElse: 'first entry',
                            subRelation: {
                                subKey: 'irgendwas'
                            }
                        },
                        {
                            oneTwoNKey: 'mykey',
                            somethingElse: 'second entry',
                            subRelation: {
                                subKey: 'nextlevel'
                            }
                        }
                    ]
                });
            }
            catch (e) {
                console.error("e", e);
            }
            done();
        }));
        it('reads created data with relation.', (done) => __awaiter(this, void 0, void 0, function* () {
            let result = yield model.read({ id: 0 });
            expect(result.id).toBe(0);
            expect(Array.isArray(result.oneTwoNRelation)).toBeTruthy();
            expect(result.oneTwoNRelation[0].oneTwoNKey).toBe('mykey');
            expect(result.oneTwoNRelation[0].subRelation.subKey).toBe('irgendwas');
            done();
        }));
        it('updates the data with relation', (done) => __awaiter(this, void 0, void 0, function* () {
            let result = yield model.update({ id: 0 }, {
                oneTwoNRelation: {
                    somethingElse: 'onetwonrealtionsupdated',
                    subRelation: {
                        subKey: 'hanspeter'
                    }
                }
            });
            let readed = yield model.read({ id: 0 });
            expect(readed.oneTwoNRelation[0].somethingElse).toBe('onetwonrealtionsupdated');
            expect(readed.oneTwoNRelation[0].subRelation.subKey).toBe('hanspeter');
            done();
        }));
        it('removes the created data with and its relation.', (done) => __awaiter(this, void 0, void 0, function* () {
            let result = yield model.remove({ id: 0 });
            expect(result).toBeTruthy();
            result = yield model.read({ id: 0 });
            expect(result).toBe(null);
            let relationModel = new RelationModelOneTwoN();
            let realtionResult = yield relationModel.read({ id: 0 });
            expect(realtionResult).toBe(null);
            realtionResult = yield relationModel.read({ id: 0 });
            expect(realtionResult).toBe(null);
            done();
        }));
    });
});
//# sourceMappingURL=relation.deep-linking.one2n.spec.js.map