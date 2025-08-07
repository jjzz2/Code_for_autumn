
// apply
Function.prototype.apply=function (context,argsArr){
    context=context||window
    let fn=Symbol('fn')
    context[fn]=this
    context[fn](...argsArr)
    delete context[fn]
}

