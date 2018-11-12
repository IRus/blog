
// Add load event listener
addEventListener("DOMContentLoaded", onLoaded, false);
addEventListener("load", onLoaded, false);

const fns: Callback[] = [];

type Callback = () => void;
export function onLoad(fn: Callback) {
    fns.push(fn);
}

let called = false;
function onLoaded() {
    if (called) {
        return;
    } else {
        called = true;
    }

    fns.forEach(fn => {
        try {
            fn();
        } catch (e) {
            console.log("Some error occurred", fn, e);
        }
    });
}
