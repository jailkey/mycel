export function mixin(target: any, baseList: any[]) {
    baseList.forEach(base => {
        console.log("base.prototype", Object.getOwnPropertyNames(base.prototype))
        Object.getOwnPropertyNames(base.prototype).forEach(name => {
            console.log("add property", name)
            target.prototype[name] = base.prototype[name];
        });
    });
    return target;
}