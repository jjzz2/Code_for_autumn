
//将剩余的参数进行联系
Function.prototype.bind=function(context,...args){
    context=context||window
    let fn=Symbol('fn')
    context[fn]=this
    return function (..._args){
        args=args.concat(..._args)
        //一般都要返回结果
        const result= context[fn](...args)
        delete context[fn]
        return result
    }
}
