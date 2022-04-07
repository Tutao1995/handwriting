const FULFILLED = 'fulfilled';
const PENDING = 'pending';
const REJECTED = 'rejected';
const _toString = Object.prototype.toString;
const isFn = value => {
    return _toString.call(value).slice(8, -1) === 'Function';
};
const isObj = value => {
    return _toString.call(value).slice(8, -1) === 'Object';
};
const isNull = value => {
    return value === null;
};
const resolvePromise = (promise, value, resolve, reject) => {
    if (promise === value) {
        //自己掉自己，出错
        return reject(new TypeError('Chaining cycle detected for promise #<Promise>'));
    }
    if (isNull(value)) {
        return resolve(value);
    }
    if (isFn(value) || isObj(value)) {
        let then;
        try {
            then = value.then;
        } catch (e) {
            return reject(e);
        }
        // 如果then是方法  那么就把该then当成promise
        if (isFn(then)) {
            let called = false; // 因为状态只能由pending到fulfilled/reject，因此这里添加一个锁，只能执行一个。
            try {
                then.call(
                    // this
                    value,
                    // resolve
                    value => {
                        if (called) return;
                        called = true;
                        resolvePromise(promise, value, resolve, reject);
                    },
                    // reject
                    value => {
                        if (called) return;
                        called = true;
                        reject(value);
                    }
                );
            } catch (e) {
                if (called) return;
                return reject(e);
            }
        } else {
            return resolve(value);
        }
    } else {
        return resolve(value);
    }
};

class _Promise {
    constructor(executor) {
        try {
            executor(this.resolve, this.reject);
        } catch (e) {
            this.reject(e);
        }
    }
    status = PENDING; // 状态 只能由pending =》 fulfilled/rejected
    value = null; // 执行成功的返回值
    reason = null; // 执行失败的返回值
    onFulfilledCallbackList = []; // 所有的成功的回调
    onRejectedCallbackList = []; // 所有的失败的回调
    resolve = value => {
        if (this.status === PENDING) {
            this.status = FULFILLED; // 修改状态
            this.value = value; // 赋值。
            while (this.onFulfilledCallbackList.length) {
                this.onFulfilledCallbackList.shift(value); // 执行 回调 并且回调函数出栈
            }
        }
    };
    reject = value => {
        if (this.status === PENDING) {
            this.status = REJECTED;
            this.reason = value;
            while (this.onRejectedCallbackList.length) {
                this.onRejectedCallbackList.shift(value);
            }
        }
    };
    then(onFulfilled, onRejected) {
        const realResolve = isFn(onFulfilled) ? onFulfilled : value => value;
        const realReject = isFn(onRejected)
            ? onRejected
            : value => {
                  throw value;
              };

        const subPromise = new _Promise((resolve, reject) => {
            const onFulfilledMicrotask = () => {
                // 处理异步的情况。
                setTimeout(() => {
                    try {
                        const x = realResolve(this.value);
                        resolvePromise(subPromise, x, resolve, reject);
                    } catch (e) {
                        reject(e);
                    }
                }, 0);
            };
            const onRejectedMicrotask = () => {
                setTimeout(() => {
                    try {
                        const x = realReject(this.reason);
                        resolvePromise(subPromise, x, resolve, reject);
                    } catch (e) {
                        reject(e);
                    }
                }, 0);
            };
            const onPendingMicrotask = () => {
                this.onFulfilledCallbackList.push(onFulfilledMicrotask);
                this.onRejectedCallbackList.push(onRejectedMicrotask);
            };
            const handleMap = {
                [FULFILLED]: onFulfilledMicrotask,
                [REJECTED]: onRejectedMicrotask,
                [PENDING]: onPendingMicrotask
            };
            handleMap[this.status]();
        });
        // 为了满足链式调用，需要返回一个一个对象
        return subPromise;
    }
    // 暴露给外部的方法
    static resolve(param) {
        if (param instanceof _Promise) {
            return param;
        }
        return new _Promise(resolve => {
            resolve(param);
        });
    }
    static reject(reason) {
        return new _Promise((resolve, reject) => {
            reject(reason);
        });
    }
    // 所有的都成功那就成功
    static all(promises) {
        return new _Promise((resolve, reject) => {
            let i = 0;
            let result = [];
            const processDate = (index, data) => {
                result[index] = data;
                if (++i === promises.length) {
                    resolve(result);
                }
            };
            for (let i = 0; i < promises.length; i++) {
                promises[i].then(function (data) {
                    processDate(i, data);
                }, reject);
            }
        });
    }
    // 有一个成功那就成功，如果第一个是失败，就失败。
    static race(promises) {
        return new _Promise((resolve, reject) => {
            for (let i = 0; i < promises.length; i++) {
                promises[i].then(resolve, reject);
            }
        });
    }
}
