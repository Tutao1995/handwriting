/* 
clone分为浅克隆和深克隆

浅克隆就是对其内容的简单复制，当其复制对象属性中存在对象时，该属性变化，则克隆的值也会变化，因为他们的对象引用是同一份内存地址

深克隆 就是对其内容的简单复制，当其复制对象属性中存在对象时，该属性变化，则克隆的值不会变化
*/

const isPlainObj = obj => typeof obj === 'object'

const isObject = obj => {
    return Object.prototype.toString.call(obj).slice(8, -1) === 'Object'
}

const isArray = obj => {
    return Object.prototype.toString.call(obj).slice(8, -1) === 'Array'
}

const shallowClone = source => {
    if (!isPlainObj(source)) return source
    let result = {}
    for (let key in source) {
        result[key] = source[key]
    }
    return result
}

const deepClone = source => {
    if (!isPlainObj(source)) return source
    let result = isObject(source) ? {} : []
    for (let key in source) {
        result[key] = isPlainObj(source[key]) ? deepClone(source[key]) : source[key]
    }
    return result
}

/* 
    暴力克隆
    JSON.parse(JSON.stringify(obj))

    问题：当属性值为function时，这样的属性不能克隆
*/

const forceClone = obj => JSON.parse(JSON.stringify(obj))
