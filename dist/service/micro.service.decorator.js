"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function MicroService(options) {
    console.log("options", options);
    return function (target) {
        var original = target;
        function construct(constructor, args) {
            let newInstance = new constructor(...args);
            //add controllers to the service if available
            if (options.controller && options.controller.length) {
                options.controller.forEach((contr) => {
                    newInstance.controller.register(new contr());
                });
            }
            //if there is a connector put it to the service 
            if (options.connector) {
                newInstance.connector = options.connector;
            }
            return newInstance;
        }
        var f = function (...args) {
            return construct(original, args);
        };
        f.prototype = original.prototype;
        return f;
    };
}
exports.MicroService = MicroService;
//# sourceMappingURL=micro.service.decorator.js.map