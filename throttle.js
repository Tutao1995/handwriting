/* 
    节流的原理很简单：

    如果你持续触发事件，每隔一段时间，只执行一次事件。

    根据首次是否执行以及结束后是否执行，效果有所不同，实现的方式也有所不同。
    我们用 leading 代表首次是否执行，trailing 代表结束后是否再执行一次。

    关于节流的实现，有两种主流的实现方式，一种是使用时间戳，一种是设置定时器。
*/

const throttle = (fn, delay) => {
    let timer = null;
    let previous = 0;
    let self, args;
    const later = function () {
        previous = +new Date();
        timer = null;
        fn.apply(self, args);
    };
    const throttled = function () {
        let now = +new Date();
        let remaining = delay - (now - previous);
        self = this;
        args = arguments;
        if (remaining <= 0 || remaining > delay) {
            if (timer) {
                clearTimeout(timer);
                timer = null;
            }
            previous = now;
            fn.apply(self, args);
        } else {
            timer = setTimeout(later, remaining); // 剩余时间小于 延迟时间，会再执行一次，然后再清空定时器
        }
    };
    return throttled;
};

/* 
    使用时间戳，当触发事件的时候，我们取出当前的时间戳，然后减去之前的时间戳(最一开始值设为 0 )，
    如果大于设置的时间周期，就执行函数，然后更新时间戳为当前的时间戳，如果小于，就不执行。
*/

const throttleByDate = (fn, delay) => {
    let previous = 0;
    return function () {
        let self = this;
        let args = arguments;
        let now = +new Date();
        if (now - previous > delay) {
            fn.apply(self, args);
            previous = now;
        }
    };
};

/* 
    使用定时器，当触发事件的时候，我们设置一个定时器，再触发事件的时候，如果定时器存在，就不执行，
    直到定时器执行，然后执行函数，清空定时器，这样就可以设置下个定时器。
*/

const throttleByTimeout = (fn, delay) => {
    let timer = null;
    return function () {
        let self = this;
        let args = arguments;
        if (!timer) {
            timer = setTimeout(() => {
                timer = null;
                fn.apply(self, args);
            }, delay);
        }
    };
};

/* 
    第一种事件会立刻执行，第二种事件会在 n 秒后第一次执行
    第一种事件停止触发后没有办法再执行事件，第二种事件停止触发后依然会再执行一次事件
*/
