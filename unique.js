/**
 * 数组去重
 *
 */

const unique = arr => {
    return [...new Set(arr)]
}

const unique2 = arr => {
    let map = {}
    return arr.filter(item => {
        if (map[item] === undefined) {
            map[item] = true
            return true
        }
    })
}

/**
 * 字符串去重
 */

String.prototype.unique = function () {
    let map = {}
    let str = ''
    let len = this.length
    for (let i = 0; i < len; i++) {
        const item = this[i]
        if (map[item] === undefined) {
            map[item] = true
            str += item
        }
    }
    return str
}
