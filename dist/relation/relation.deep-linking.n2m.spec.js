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
let RelationModelMTwoNOne = class RelationModelMTwoNOne extends model_1.Model {
    constructor() {
        super();
        this.id = 0;
        this.mTwoNTest = '';
    }
};
__decorate([
    model_key_decorator_1.Key,
    model_autoincrement_decorator_1.AutoIncrement,
    __metadata("design:type", Number)
], RelationModelMTwoNOne.prototype, "id", void 0);
RelationModelMTwoNOne = __decorate([
    model_options_decorator_1.ModelOptions({
        storage: new file_storage_1.FileStorage({
            path: './tmp/n2m',
            name: 'my_relation_model_m_two_n_deep_one_test',
            permissions: new storage_permissions_1.StoragePermissions(true, true)
        })
    }),
    __metadata("design:paramtypes", [])
], RelationModelMTwoNOne);
let RelationModelMTwoNTwo = class RelationModelMTwoNTwo extends model_1.Model {
    constructor() {
        super();
        this.id = 0;
        this.anders = '';
    }
};
__decorate([
    model_key_decorator_1.Key,
    model_autoincrement_decorator_1.AutoIncrement,
    __metadata("design:type", Number)
], RelationModelMTwoNTwo.prototype, "id", void 0);
RelationModelMTwoNTwo = __decorate([
    model_options_decorator_1.ModelOptions({
        storage: new file_storage_1.FileStorage({
            path: './tmp/n2m',
            name: 'my_relation_model_m_two_n_deep_two_test',
            permissions: new storage_permissions_1.StoragePermissions(true, true)
        })
    }),
    __metadata("design:paramtypes", [])
], RelationModelMTwoNTwo);
let MyN2MTestModel = class MyN2MTestModel extends model_1.Model {
    constructor() {
        super(...arguments);
        this.id = 0;
        this.mTwoNRelation = null;
    }
};
__decorate([
    model_key_decorator_1.Key,
    model_autoincrement_decorator_1.AutoIncrement,
    __metadata("design:type", Number)
], MyN2MTestModel.prototype, "id", void 0);
__decorate([
    relation_1.Relation([RelationModelMTwoNOne, RelationModelMTwoNTwo], {
        type: relation_types_1.RelationTypes.m2n,
        linking: relation_types_1.LinkTypes.deep
    }),
    __metadata("design:type", relation_1.ModelRelation)
], MyN2MTestModel.prototype, "mTwoNRelation", void 0);
MyN2MTestModel = __decorate([
    model_options_decorator_1.ModelOptions({
        storage: new file_storage_1.FileStorage({
            path: './tmp/n2m',
            name: 'my_m2n_model_with_relation_test',
            permissions: new storage_permissions_1.StoragePermissions(true, true)
        })
    })
], MyN2MTestModel);
describe('@Relations - Test n2m relations with deep linking', () => {
    let model;
    it('creats a new model instance.', () => {
        model = new MyN2MTestModel();
    });
    it('create new model entries', (done) => __awaiter(this, void 0, void 0, function* () {
        try {
            let result = yield model.create({
                mTwoNRelation: [
                    {
                        'RelationModelMTwoNOne.mTwoNTest': 'irgendwas'
                    },
                    {
                        'RelationModelMTwoNTwo.anders': 'wasanderes'
                    }
                ]
            });
        }
        catch (e) {
            console.log("E", e);
        }
        done();
    }));
    it('test if the model entries are saved', (done) => __awaiter(this, void 0, void 0, function* () {
        let result = yield model.read({ id: 0 });
        expect(result.mTwoNRelation[0].mTwoNTest).toBe('irgendwas');
        expect(result.mTwoNRelation[1].anders).toBe('wasanderes');
        done();
    }));
    it('updates the model entries', (done) => __awaiter(this, void 0, void 0, function* () {
        let result = yield model.update({ id: 0 }, {
            mTwoNRelation: [
                {
                    'RelationModelMTwoNOne.mTwoNTest': 'somethingchanged'
                },
                {
                    'RelationModelMTwoNTwo.anders': 'someotherthingchanged'
                }
            ]
        });
        done();
    }));
    it('reads the updated data and checks it', (done) => __awaiter(this, void 0, void 0, function* () {
        let result = yield model.read({ id: 0 });
        expect(result.mTwoNRelation[0].mTwoNTest).toBe('somethingchanged');
        expect(result.mTwoNRelation[1].anders).toBe('someotherthingchanged');
        done();
    }));
    it('remove the entries', (done) => __awaiter(this, void 0, void 0, function* () {
        let result = yield model.remove({ id: 0 });
        expect(result).toBeTruthy();
        done();
    }));
    it('checks if all entries are removed', (done) => __awaiter(this, void 0, void 0, function* () {
        let result = yield model.read({ id: 0 });
        expect(result).toBe(null);
        let subModelOne = new RelationModelMTwoNOne();
        let subResultOne = yield subModelOne.read({ id: 0 });
        expect(subResultOne).toBe(null);
        let subModelTwo = new RelationModelMTwoNTwo();
        let subResultTwo = yield subModelTwo.read({ id: 0 });
        expect(subResultTwo).toBe(null);
        done();
    }));
});
//# sourceMappingURL=relation.deep-linking.n2m.spec.js.map