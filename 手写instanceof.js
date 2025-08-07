function myInstanceof(obj,constructor){
    //实现链式调用
    if (typeof constructor!=='function'){
        throw new TypeError('it is not a function')
    }
    if (typeof obj!=='object'||obj===null){
        return false
    }
    let proto=Object.getPrototypeOf(obj)
    while(proto){
        if (proto===constructor.prototype){
            return true
        }
        proto=Object.getPrototypeOf(proto)
    }
    return false
}