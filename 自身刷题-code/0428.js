//1.手写instanceof
function myInstanceOf(obj,tar){
    let __proto__=Object.getPrototypeOf(obj)
    let prototype=tar.prototype
    while(__proto__){
        if (__proto__===prototype)return true
        __proto__=Object.getPrototypeOf(prototype)
    }
    return prototype
}
function myNew(constructor,...args){
    let obj={}
    obj.__proto__=constructor.prototype
    let result= constructor.apply(obj,...args)
    return result instanceof Object?result:obj
}
//手写call
function myCall(context,...args){
    context=context||window
    let fnSymbol=Symbol('fn')
    context[fnSymbol]=this
    context[fnSymbol](args)
    delete context[fnSymbol]
}
//防抖+节流
function debounce(fn){
    let timer
    return function (...args){
        if (timer)clearTimeout(timer)
        timer = setTimeout(()=>{
            fn.apply(this,...args)
        })
    }

}
function throttle(fn,...args){

}



