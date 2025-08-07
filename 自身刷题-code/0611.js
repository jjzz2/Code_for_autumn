//1.手写instanceOf
function MyInstanceOf(obj,tar){
    let __proto__=Object.getPrototypeOf(obj)
    let prototype=tar.prototype
    while(__proto__){
        if (__proto__===prototype)return true
        __proto__=Object.getPrototypeOf(__proto__)
    }
    return false
}
function myNew(constructor,...args){
    let newObj={}
    newObj.__proto__=constructor.prototype
    let result=constructor.apply(newObj,...args)
    return result instanceof Object?result:newObj
}
//手写call，apply，bind
function MyCall(context,...args){
    context=context||window
    let fnSymbol=Symbol('fn')
    context[fnSymbol]=this
    const result=context[fnSymbol](...args)
    delete context[fnSymbol]
    return result
}
//手写深拷贝
function deepClone(object,hash=new WeakMap()){
    if (!object||typeof object!=='object')return object
    if (hash.get(object))return hash.get(object)
    let cloneObj=Array.isArray(object)?[]:{}
    hash.set(obj,cloneObj)
    for (let key in obj){
        if (obj.hasOwnProperty(key)){
            cloneObj[key]=deepClone(object[key])
        }
    }
    return cloneObj
}
//ajax
function MyAjax(url){}

