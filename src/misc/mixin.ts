export function mixin(target: any, baseList: any[]) {
    baseList.forEach(base => {
        Object.getOwnPropertyNames(base.prototype).forEach(name => {
            target.prototype[name] = base.prototype[name];
        });
    });
    return target;
}