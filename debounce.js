/* 
    window 的 resize、scroll
    mousedown、mousemove
    keyup、keydown
*/
const debounce = (fn, delay, immediate) => {
    let timer = null;
    let result = null; // 立即执行函数可能存在返回值的情况。 immediate：true时
    return () => {
        const self = this; // 保证this的正确指向。
        const args = arguments; // 保证参数正确。 event 对象
        if (timer) clearTimeout(timer);
        if (immediate) {
            let callNow = !timer;
            timer = setTimeout(() => {
                timer = null;
            }, delay);
            callNow && (result = fn.apply(self, args));
        } else {
            timer = setTimeout(() => {
                fn.apply(self, args);
            }, delay);
        }
        return result;
    };
};

// 动画
function _debounce(func) {
    var t;
    return function () {
        cancelAnimationFrame(t);
        t = requestAnimationFrame(func);
    };
}
