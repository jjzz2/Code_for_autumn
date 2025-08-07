//1.instanceOf
function myInstanceOf(obj,tar){
    //1.找到自身的隐式原型
    let __proto__=Object.getPrototypeOf(obj)
    //2.自身的显式原型
    let proto=tar.prototype
    //3.向上延生
    while(__proto__){
        if(proto ===__proto__){
            return true
        }
        __proto__=Object.getPrototypeOf(__proto__)
    }
    return false
}
//2.手写new
function myNew(constructor,args){
    let newObj={}
    newObj.__proto__=constructor.prototype
    //对物体进行指向
    let result=constructor.apply(newObj,...args)
    return result instanceof Object?result:newObj
}
//手写call
function myCall(context,...args){
    context=context||this.window
    let fn=Symbol('fn')
    context[fn]=this
    let result= context[fn](args)
    delete context[fn]
    return result
}
function myApply(context,args){
    context=context||this.window
    let fn=Symbol('fn')
    context[fn]=this
    let result=context[fn](...args)
    delete context[fn]
    return result
}
function myBind(context,...args){
    context=context||this.window
    let fn=Symbol('fn')
    context[fn]=this
    return function (...args2){
        args2=args2.concat(...args)
        let result=context[fn](...args2)
        delete context[fn]
        return result
    }
}
//deepclone
function myDeepClone(obj){
    if (typeof obj!=='object'||obj===null)return obj
    let cloneObj=Array.isArray(obj)?[]:{}
    for (let key of obj){
        if (Object.hasOwnProperty(key)){
            cloneObj[key]=myDeepClone(obj)
        }else{
            cloneObj[key]=obj[key]
        }

    }
    return cloneObj
}
function debounce(delay,fn){
    let pre=Date.now()
    return function (...args){
        let now=Date.now()
        if (now-pre>=delay){
            fn.apply(this,...args)
        }
        pre = now
    }
}
function throttle(delay,fn){
    let timer
    return function (...args){
        if (timer)clearTimeout(timer)
        timer=setTimeout(()=>{
            fn.apply(this,...args)
        },delay)

    }
}
