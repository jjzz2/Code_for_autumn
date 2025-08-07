//1.手写防抖
function debounce(fn,wait){
    let timer;
    return function (...args){
        if (timer)clearTimeout(timer)
        timer = setTimeout(
            ()=>{fn.apply(this,args)
            }, wait)
    }
}
//2.手写curry函数
function curry(fn){
    return function curried(...args) {
        if (fn.length>args.length){
            fn.apply(this,...args)
        }else{
            return function (args2){
                args=args.concat(args,...args2)
                curried.apply(this,...args)
            }
        }
    }
}
//3.array to Tree
function arrayToTree(arr){
    if (typeof arr!=='function'){
        throw new Error()
    }
    let map={}
    let res=[]
    for (let item of arr){
        map[item.id]=item
    }
    for (let i=0;i<arr.length;i++){
        let pid=arr[i].pid
        if (map[pid]){
            //初始化
            map[pid].children=map[pid].children||[]
            map[pid].children.push(arr[i])
        }else{
            res.push(map[i])
        }
    }
    return res
}
//手写call
function myCall(context,...args){
    context=context||window
    let fnSymbol=Symbol('fn')
    context[fnSymbol]=this
    context[fnSymbol](args)
    delete context[fnSymbol]
}
//手写instanceof
function myInstanceof(obj,tar){
    let proto=obj.prototype
    let prototype=Object.getPrototypeOf(tar)
    while(proto){
        if (proto===prototype)return true
        proto=Object.getPrototypeOf(proto)
    }
    return false
}
//手写