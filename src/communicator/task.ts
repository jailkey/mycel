export function Task(){
    var resolveMe, rejectMe;

    let promise = new Promise((resolve : Function, reject : Function) => {
        resolveMe = resolve;
        rejectMe = reject;
    })

    return {
        promise : promise,
        resolve : resolveMe,
        reject : rejectMe
    }
}