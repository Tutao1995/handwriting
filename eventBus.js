/* 
    发布订阅模式的发布和订阅都由一个调度中心来处理
    发布订阅模式是完全解耦的，因为调度中心中存的直接就是逻辑处理函数
    要点：都要实现添加/删除/派发更新三个事件
*/

class EventBus {
    constructor() {}
    eventList = {}
    on(type, callback) {
        if (!this.eventList[type]) {
            this.eventList[type] = []
        }
        this.eventList[type].push(callback)
    }
    off(type, handler) {
        if (this.eventList[type]) {
            if (handler) {
                const index = this.eventList[type].findIndex(el => el === handler)
                if (index === -1) {
                    throw Error('无效事件:' + type)
                } else {
                    this.eventList[type].splice(index, 1)
                }
                if (!this.eventList[type].length) {
                    delete this.eventList[type]
                }
            } else {
                delete this.eventList[type]
            }
        } else {
            throw Error('无效事件:' + type)
        }
    }
    dispatch(type) {
        const params = Array.prototype.slice.call(arguments, 1)
        const callbacks = this.eventList[type]
        if (callbacks) {
            if (callbacks.length) {
                callbacks.forEach(callback => {
                    callback(...params)
                })
            }
        } else {
            throw Error('请先绑定事件' + type)
        }
    }
}
