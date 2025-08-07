const quickSort=function (arr){
    if (arr.length<1){
        return arr
    }
    let left=[]
    let right=[]
    let midIndex=Math.floor(arr.length/2)
    let midIndexVal=arr[midIndex]
    for (let i=0;i<arr.length;i++){
        if (i!==midIndex){
            //使用这种内联式的来进行连接
            if(arr[i]<midIndexVal){
                left.push(arr[i])
            }
            if (arr[i]>midIndexVal){
                right.push(arr[i])
            }
        }
    }
    //注意这里是进行递归调用
    return quickSort(left).concat([midIndexVal],quickSort(right))
}
const arr=[1,3424,432423,54231]
console.log(quickSort(arr))
function sum(x,y,z) {
    return x + y + z
}

function hyCurry(fn){
    return function curried(...args1){
        if(fn.length<=args1.length){
            //是args1不是...args1
            return fn.apply(this,args1)
        }else return function (...args2){
            args1=args1.concat(...args2)
            return curried.apply(this,args1)
        }
    }
}
function sum(...args){
    let total=args.reduce((accu,cur)=>accu+cur,0)
    function add(...args2){
        total+=args2.reduce((accu,cur)=>accu+cur,0)
        //时刻注意要进行链式调用
        return args2
    }
    add.sumOf=()=>{return total}
    return add
}

var curryAdd = hyCurry(sum)

curryAdd(10,20,30)
curryAdd(10,20)(30)
curryAdd(10)(20)(30)
//