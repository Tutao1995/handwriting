/* 
定义：定义一种一对多的关系，这里的‘一’我们称为目标对象（Subject），它拥有新增、删除、通知等方法，而‘多’则称为观察者对象(Observer)，
它可以接受目标对象的状态改变并进行处理，目标对象可以添加一系列的观察者对象，当目标对象的状态发生改变时，就会通知所有的观察者对象。
迭代
*/

class Subject {
    constructor() {
        this.observers = new Set()
    }
    add(observer) {
        this.observers.add(observer)
    }
    remove(observer) {
        this.observers.has(observer) && this.observers.remove(observer)
    }
    notify() {
        this.observers.forEach(item => {
            item.update()
        })
    }
}

class Observer {
    constructor(name) {
        this.name = name
    }
    update() {
        console.log(this.name)
    }
}

let sub = new Subject()
let obs1 = new Observer('observer11')
let obs2 = new Observer('observer22')
sub.add(obs1)
sub.add(obs2)
sub.notify()
