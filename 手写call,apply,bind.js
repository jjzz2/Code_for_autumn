// call函数实现
Function.prototype.myCall = function(context) {
    if (typeof this!=='function'){
        console.error('error')
    }
    let args=[...arguments].slice(1)
    let result=null
    context=context||window
    context.fn=this
    result=context.fn
    delete context.fn
    return result
};
// apply 函数实现
Function.prototype.myApply = function(context) {
    // 判断调用对象是否为函数
   if (typeof this!=="function"){
       console.error('error')
   }
   let result=null
    context=context||window
    context.fn=this
    if (arguments[1]){
        result=context.fn(...arguments[1])
    }else{
        result=context.fn()
    }
    delete context.fn
    return result
};
// bind 函数实现
Function.prototype.myBind = function(context) {
    // 判断调用对象是否为函数
    if (typeof this!=="function"){
        console.error('error')
    }
    let args=[...arguments].slice(1)
    let fn=this
    return function Fn(){
        return fn.apply(this instanceof Fn?this:context,args.concat(...arguments))
    }
};
