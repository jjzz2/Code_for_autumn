function curry(fn){
    if (typeof fn!=='function'){
        throw new Error('it needs a function')
    }
    //检查参数长度是否达到了需求，如果没有达到需求的话那么就一直添加知道达到需求
    return function curried(...args){
        if (args.length>=fn.length){
            return fn.apply(this,args)
        }else{
            return function (...args2){
               return curried.apply(this,args.concat(...args2))
            }
        }

    }
}