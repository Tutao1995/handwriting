/* 
    数组扁平化
*/

const flat = arr => {
    return arr.reduce((previousValue, currentValue) => {
        return previousValue.concat(Array.isArray(currentValue) ? flat(currentValue) : currentValue);
    }, []);
};

const test = [1, 2, 4, [2, 2, 4, [8, 9]]];
console.log(flat(test));
