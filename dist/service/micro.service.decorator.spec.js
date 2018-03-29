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
const micro_service_decorator_1 = require("./micro.service.decorator");
const service_1 = require("./service");
const controller_1 = require("../controller/controller");
const controller_options_decorator_1 = require("../controller/controller.options.decorator");
const command_decorator_1 = require("../command/command.decorator");
const service_request_1 = require("./service.request");
const model_1 = require("../model/model");
const model_options_decorator_1 = require("../model/model.options.decorator");
const model_key_decorator_1 = require("../model/model.key.decorator");
const model_autoincrement_decorator_1 = require("../model/model.autoincrement.decorator");
const file_storage_1 = require("../storage/file.storage");
const storage_permissions_1 = require("../storage/storage.permissions");
let MyTestModel = class MyTestModel extends model_1.Model {
    constructor() {
        super(...arguments);
        this.id = 0;
        this.myTestPropery = null;
    }
};
__decorate([
    model_key_decorator_1.Key,
    model_autoincrement_decorator_1.AutoIncrement,
    __metadata("design:type", Number)
], MyTestModel.prototype, "id", void 0);
MyTestModel = __decorate([
    model_options_decorator_1.ModelOptions({
        storage: new file_storage_1.FileStorage({
            path: './tmp',
            name: 'mico_service_test',
            permissions: new storage_permissions_1.StoragePermissions(true, true)
        })
    })
], MyTestModel);
let TestController = class TestController extends controller_1.Controller {
    constructor() {
        super(...arguments);
        this.namespace = 'MyController';
    }
    myTestControllerMethod(test) {
        return __awaiter(this, void 0, void 0, function* () {
            return 'controller' + test;
        });
    }
};
__decorate([
    command_decorator_1.Command,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], TestController.prototype, "myTestControllerMethod", null);
TestController = __decorate([
    controller_options_decorator_1.ControllerOptions({
        models: [
            MyTestModel
        ]
    })
], TestController);
let TestService = class TestService extends service_1.Service {
    constructor() {
        super();
    }
    myServiceCommand(test) {
        return test;
    }
};
__decorate([
    command_decorator_1.Command,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], TestService.prototype, "myServiceCommand", null);
TestService = __decorate([
    micro_service_decorator_1.MicroService({
        controller: [TestController]
    }),
    __metadata("design:paramtypes", [])
], TestService);
describe('@MicroService', () => {
    let service;
    it('creates a new service.', () => {
        service = new TestService();
        expect(service).toBeTruthy();
    });
    it('tests if the added controller exists.', () => {
        expect(service.controller.get(TestController) instanceof TestController).toBeTruthy();
    });
    it('tests requesting a decorated service command.', (done) => __awaiter(this, void 0, void 0, function* () {
        let request = new service_request_1.ServiceRequest('TestService.myServiceCommand', {
            test: 'somecontent'
        });
        let result = yield service.applyRequest(request);
        expect(result.data).toBe('somecontent');
        expect(result.acknowledged).toBeTruthy();
        done();
    }));
    it('tests requesting a decorated controller command.', (done) => __awaiter(this, void 0, void 0, function* () {
        let request = new service_request_1.ServiceRequest('TestService:MyController.myTestControllerMethod', {
            test: 'somecontent'
        });
        let result = yield service.applyRequest(request);
        expect(result.data).toBe('controllersomecontent');
        expect(result.acknowledged).toBeTruthy();
        done();
    }));
    it('tests requesting the model commands', (done) => __awaiter(this, void 0, void 0, function* () {
        let request = new service_request_1.ServiceRequest('TestService:MyController:MyTestModel.create', {
            data: {
                myTestPropery: 'test'
            }
        });
        let result = yield service.applyRequest(request);
        expect(result.data).toBeTruthy();
        let readResult = yield service.applyRequest(new service_request_1.ServiceRequest('TestService:MyController:MyTestModel.read', { resource: { id: 0 } }));
        expect(readResult.data.myTestPropery).toBe('test');
        expect(readResult.data.id).toBe(0);
        done();
    }));
});
//# sourceMappingURL=micro.service.decorator.spec.js.map