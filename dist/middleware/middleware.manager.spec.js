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
const middleware_manager_1 = require("./middleware.manager");
const service_request_1 = require("../service/service.request");
class TestWare {
    onRequest(request) {
        return __awaiter(this, void 0, void 0, function* () {
            return new service_request_1.ServiceRequest(request.command, { test: 'Klaus Dieter' });
        });
    }
}
describe('Service.middleware', () => {
    let manager = new middleware_manager_1.MiddlwareManager();
    describe('register()', () => {
        it('registers a new middleware', () => {
            expect(manager.register(TestWare)).toBe(manager);
        });
    });
    describe('get()', () => {
        it('gets a middleware', () => {
            expect(manager.get(TestWare) instanceof TestWare).toBeTruthy();
        });
    });
    describe('applyRequest()', () => {
        let testRequest = new service_request_1.ServiceRequest('MyService:TestController', { test: 'Hans Peter' });
        it('applys a request to the middlewares', (done) => __awaiter(this, void 0, void 0, function* () {
            expect(testRequest.data.test).toBe('Hans Peter');
            testRequest = yield manager.applyRequest(testRequest);
            expect(testRequest.data.test).toBe('Klaus Dieter');
            done();
        }));
    });
    describe('delete()', () => {
        it('Unregisters a middleware', () => {
            expect(() => manager.unregister(TestWare).get(TestWare)).toThrowError();
        });
    });
});
//# sourceMappingURL=middleware.manager.spec.js.map