Array.prototype.myReduce=function (arr,fn,initVal){
    let result=initVal
    let index=0
    if (typeof initVal==='undefined'){
        result=arr[index]
        index++
    }
    while(index<this.length){
        result=fn(result,arr[index++])
    }
    return result
}
function myReduce(initVal,array,fn){
    let res=initVal
    let index=0
    if (typeof initVal==='undefined'){
        res =arr[index]
        index++
    }
    while(index<this.length){
        res=fn()
    }
    return res
}
//手动实现sumof
const result = mySumof(1, 2, 3); // 6
console.log(result(4, 5).sumOf());  // 15
result(10).sumOf();  // 25

function mySumof(...args1){
    let total=args1.reduce((accu,cur)=>accu+cur,0)
    function add(...args2){
        total=args2.reduce((accu,cur)=>accu+cur,total)
        //必须返回形成链式调用
        return add
    }
    add.sumOf=()=>{return total}
    return add
}

