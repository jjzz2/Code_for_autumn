function myNew(constructor,...args){
    let obj={}
    obj.__proto__=constructor.prototype
    let result=constructor.apply(obj,args)
    return result instanceof Object?result:obj
}