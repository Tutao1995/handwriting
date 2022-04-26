/**
 * 一维数组生成树形结构数据
 * @param source 一维数组
 * @param startParentId 父级 id
 * @param parentKey 父级字段 key
 * @param uniKey 可选，唯一标识字段 key，默认：id
 */

const array2Tree = (source, startParentId, parentKey, uniKey) => {
    const result = { children: [] }
    const idMap = source.reduce((acc, el, i) => {
        acc[el[uniKey]] = i
        return acc
    }, {})
    source.forEach(element => {
        if (element[parentKey] === startParentId) {
            result.children.push(element)
            return
        }
        const parentEl = source[idMap[element[parentKey]]]
        parentEl.children = [...(parentEl.children || []), element]
    })
    return result
}

/**
 * 一维数组生成树形结构数据
 * @param arr 一维数组
 * @param parentId 父级 id
 * @param parentKey 父级字段 key
 * @param uniKey 可选，唯一标识字段 key，默认：id
 */
const generateTree = (arr, parentId, parentKey, uniKey = 'id') => {
    const result = []
    for (let i = 0; i < arr.length; i++) {
        const item = arr[i]
        if (item[parentKey] === parentId) {
            result.push(item)
            item.children = generateTree(arr, item[uniKey], parentKey, uniKey)
        }
    }
    return result
}

let test = [
    { id: 1, parentId: 0 },
    { id: 2, parentId: 1 },
    { id: 3, parentId: 2 },
    { id: 4, parentId: 0 }
]

console.log(generateTree(test, 0, 'parentId', 'id'))
