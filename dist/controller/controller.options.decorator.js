"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function ControllerOptions(options) {
    return function (target) {
        var original = target;
        function construct(constructor, args) {
            let newInstance = new constructor(...args);
            newInstance.__name = target.name;
            if (options.namespace) {
                newInstance.namespace = options.namespace;
            }
            if (options.controller && options.controller.length) {
                options.controller.forEach((contr) => {
                    newInstance.controller.register(new contr());
                });
            }
            if (options.models && options.models.length) {
                options.models.forEach((model) => {
                    newInstance.models.register(model);
                });
            }
            return newInstance;
        }
        var wrapped = function (...args) {
            return construct(original, args);
        };
        wrapped.prototype = original.prototype;
        wrapped.__name = target.name;
        return wrapped;
    };
}
exports.ControllerOptions = ControllerOptions;
//# sourceMappingURL=controller.options.decorator.js.map