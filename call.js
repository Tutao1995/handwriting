/* 
改变函数的this指向，第一个参数为this的指向，后续参数为 函数执行的参数
1.第一个参数为空的情况，this指向window
2.第二个参数为null或者其他。
*/

Function.prototype._call = function (context) {
    if (!context) {
        context = window;
    }
    let fn = Symbol(context);
    context[fn] = this;
    let arg = Array.prototype.slice.call(arguments, 1);
    context[fn](...arg);
    delete context[fn];
};
