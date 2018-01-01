import { MiddlwareManager } from './middleware.manager';
import { ServiceRequest } from '../service/service.request';
import { MiddlewareRequest } from './middleware';

class TestWare implements MiddlewareRequest {
    public async onRequest(request : ServiceRequest) : Promise<ServiceRequest>{

        return new ServiceRequest(request.command, { test : 'Klaus Dieter' });
    }
}

describe('Service.middleware', () => {
    
    let manager = new MiddlwareManager();

    describe('register()', () => {
        it('registers a new middleware', () => {
            expect(manager.register(TestWare)).toBe(manager);
        })
    })

    describe('get()', () => {
        it('gets a middleware', () => {
            expect(manager.get(TestWare) instanceof TestWare).toBeTruthy();
        })
    })

    describe('applyRequest()', () => {
        let testRequest = new ServiceRequest('MyService:TestController', { test : 'Hans Peter' });

        it('applys a request to the middlewares', async (done) => {
            expect(testRequest.data.test).toBe('Hans Peter');
            testRequest = await manager.applyRequest(testRequest);
            expect(testRequest.data.test).toBe('Klaus Dieter');
            done();
        })
    })

    describe('delete()', () => {
        it('Unregisters a middleware', () => {
            expect(() => manager.unregister(TestWare).get(TestWare)).toThrowError()
        })
    })
})