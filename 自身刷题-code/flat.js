function flatArr(args){
    if(!Array.isArray(args)){
        console.error()
    }
    let result=[]
    for(let item of args){
        if(Array.isArray(item)){
            //无论怎样，result都要进行相互连接
            result=result.concat(flatArr(item))
        }else{
            result.push(item)
        }
    }
    return result
}
let nestedArray = [1, [2, [3, [4]], 5]];
console.log(flatArr(nestedArray)); // 输出 [1, 2, 3, 4, 5]
