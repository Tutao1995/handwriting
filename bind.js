/* 
bind() 方法会创建一个新函数。当这个新函数被调用时，bind() 的第一个参数将作为它运行时的 this，之后的一序列参数将会在传递的实参前传入作为它的参数。(来自于 MDN )
1.创建一个新函数，改变this指向
2.可以传参
3.一个绑定函数也能使用new操作符创建对象：这种行为就像把原函数当成构造器。提供的 this 值被忽略，同时调用时的参数被提供给模拟函数。
*/
// 改变this
Function.prototype._bind1 = function (context) {
    const self = this;
    return function () {
        self.apply(context);
    };
};
// 支持传参
Function.prototype._bind2 = function (context) {
    const self = this;
    const args = Array.prototype.slice.call(arguments, 1);
    const realThis = context;
    return function () {
        const subArgs = Array.prototype.slice.call(arguments);
        self.apply(realThis, args.concat(subArgs));
    };
};
// 添加作为构造函数时，this无效。
Function.prototype._bind3 = function (context) {
    if (typeof this !== 'function') {
        throw new Error('Function.prototype.bind - what is trying to be bound is not callable');
    }
    const self = this;
    const args = Array.prototype.slice.call(arguments, 1);
    const realThis = context;
    const fn = function () {
        const subArgs = Array.prototype.slice.call(arguments);
        // 当作为构造函数时，this 指向实例，self 指向绑定函数，因为下面一句 `fn.prototype = this.prototype;`，已经修改了 fn.prototype 为 绑定函数的 prototype，此时结果为 true，当结果为 true 的时候，this 指向实例。
        // 当作为普通函数时，this 指向 window，self 指向绑定函数，此时结果为 false，当结果为 false 的时候，this 指向绑定的 context。
        self.apply(this instanceof self ? this : realThis, args.concat(subArgs));
    };
    const Temp = function () {};
    Temp.prototype = this.prototype;
    fn.prototype = new Temp();
    return fn;
};
