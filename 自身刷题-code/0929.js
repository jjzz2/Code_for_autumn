//1.instanceOf
function MyInstanceOf(target,obj){
    let __proto__=Object.getPrototypeOf(obj)
    const prototype=target.prototype
    while(__proto__){
        if (__proto__===prototype)return true
        __proto__=Object.getPrototypeOf(__proto__)
    }
    return false
}
function myNew(constructor,...args){
    let obj={}
    let prototype=constructor.prototype
    obj.__proto__=prototype
    let result=constructor.apply(obj,...args)
    return result instanceof Object?result:obj
}
function myCall(ctx,args){
    ctx=ctx||window
    let fnSymbol=Symbol('fn')
    ctx[fnSymbol]=this
    let result=ctx[fnSymbol](...args)
    delete ctx[fnSymbol]
    return result
}
function myApply(ctx,...args){
    ctx=ctx||window
    let fnSymbol=Symbol('fn')
    ctx[fnSymbol]=this
    let result=ctx[fnSymbol](args)
    delete ctx[fnSymbol]
    return result
}
function myBind(ctx,...args){
    ctx=ctx||window
    let fnSymbol=Symbol('fn')
    ctx[fnSymbol]=this
    return function(...args2){
        args=args.concat(args2)
        let result=ctx[fnSymbol](args)
        delete ctx[fnSymbol]
        return result
    }

}
function deepClone(obj){
    if (typeof obj!=='object'||obj===null)return
    let newObj=Array.isArray(obj)?[]:{}
    for (const key of obj){
        if (obj.hasOwnProperty(key)){
            newObj[key]=deepClone(obj[key])
        }
    }
    return newObj
}
function debounce(fn,delay){
    let timer
    return function (...args){
        if (timer)clearTimeout(timer)
        timer=setTimeout(()=>fn.apply(this,...args),delay)
    }

}
function throttle(){}
