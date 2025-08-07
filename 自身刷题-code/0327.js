//1.手写call
function myCall(context,...args){
    context=context||this
    let fnSymbol=Symbol('fn')
    context[fnSymbol]=this
    context[fnSymbol](args)
    delete context[fnSymbol]
}
//2.手写apply
function myApply(context,args){
    context=context||this
    let fnSymbol=Symbol('fn')
    context[fnSymbol]=this
    context[fnSymbol](args)
    delete context[fnSymbol]
}
//手写lazyman
function lazyMan(name){
    this.name=name
    this.queue=[]

}
