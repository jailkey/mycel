"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function mixin(target, baseList) {
    baseList.forEach(base => {
        Object.getOwnPropertyNames(base.prototype).forEach(name => {
            target.prototype[name] = base.prototype[name];
        });
    });
    return target;
}
exports.mixin = mixin;
//# sourceMappingURL=mixin.js.map