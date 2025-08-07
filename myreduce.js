Array.prototype.myReduce=function (fn,initVal){
    let result=initVal
    let index=0
    if (typeof initVal==='undefined'){
        result=this[index]
        index++
    }
    while(index<this.length){
        result=fn(result,this,this[index++],index)
    }
    return result
}