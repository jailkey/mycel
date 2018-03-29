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
 * manages all middlewares in a service
 */
class MiddlwareManager {
    constructor() {
        this.middleware = [];
    }
    /**
     * registers a new middleware
     * @param middleware the middleware class
     */
    register(middleware) {
        this.middleware.push({
            name: middleware.name,
            middleware: new middleware()
        });
        return this;
    }
    /**
     * unregisters a middleware
     * @param middleware the middleware class
     */
    unregister(middleware) {
        this.middleware = this.middleware.filter((current) => {
            return (current.name === middleware.name) ? false : true;
        });
        return this;
    }
    /**
     * gets a middlware instance by the middleware class, its not a factory the middleware will instantiated in the register method
     * @param middleware
     * @returns if found the middleware instance will be returned
     * @throws if the middleware is not registerd a Error is thrown
     */
    get(middleware) {
        let selected = this.middleware.find(current => current.name === middleware.name);
        if (selected) {
            return selected.middleware;
        }
        throw new Error('Middleware "' + middleware.name + '" is not registerd!');
    }
    /**
     * applies all registerd middlewares to a request
     * @async
     * @param request
     */
    applyRequest(request) {
        return __awaiter(this, void 0, void 0, function* () {
            for (let middlewareContainer of this.middleware) {
                request = yield middlewareContainer.middleware.onRequest(request);
            }
            return request;
        });
    }
}
exports.MiddlwareManager = MiddlwareManager;
//# sourceMappingURL=middleware.manager.js.map