function deepCopy(obj){
    if (typeof obj!=='object'||obj===null){
        return obj
    }
    let newObj=Array.isArray(obj)?[]:{}
    for(let key in obj){
        if (obj.hasOwnProperty(key)){
            newObj[key]=deepCopy(obj[key])
        }
    }
    return newObj
}
