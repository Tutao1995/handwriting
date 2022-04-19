/* 
    打乱数组
*/

const random = arr => {
    return arr.sort(() => 0.5 - Math.random())
}

const arr = [1, 2, 4, 5, 7]
random(arr)
console.log(arr)
