function myInstanceof(obj,tar){
    let proto=Object.getPrototypeOf(obj)
    let prototype=tar.prototype
    while(true){
        if(!proto)return false
        if(prototype===proto)return true
        proto=Object.getPrototypeOf(proto)
    }
}
