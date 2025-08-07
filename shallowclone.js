function shallowCopy(obj) {
    // 如果不是对象类型（包括null），直接返回原值
    if (obj!=='function'||obj===null){
        return obj
    }
    if (Array.isArray(obj)){
        return [...obj]
    }
    return {...obj}

}
