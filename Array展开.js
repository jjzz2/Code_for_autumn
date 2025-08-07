function flattenArray(arr) {
    let result=[]
    for (let i=0;i<arr.length;i++){
        if (Array.isArray(arr[i])){
            result=result.concat(flattenArray(arr[i]))
        }else {
            result.push(arr[i])
        }
    }
    return result
}

let nestedArray = [1, [2, [3, [4]], 5]];
console.log(flattenArray(nestedArray)); // 输出 [1, 2, 3, 4, 5]

//也可以使用flat方法来完成
let arr = [1,[2,[3,[4,5]]]];
// 只会扁平化一层
console.log(arr.flat(1));//[1,2,[3,[4,5]]]
// 扁平化两层
console.log(arr.flat(2));//[1,2,3,[4,5]]
// 全部扁平化
console.log(arr.flat(Infinity));//[1,2,3,4,5]

//或者使用toString方法
let arr2 = [1,[2,[3,[4,5]]]];
arr = arr.toString().split(',').map(item=>parseInt(item))
console.log(arr)